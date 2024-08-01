using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

public class ChatService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ChatService> _logger;
    private readonly IConfiguration _configuration;
    private readonly ConcurrentDictionary<WebSocket, string> _connectedSockets = new ConcurrentDictionary<WebSocket, string>();

    public ChatService(IServiceScopeFactory scopeFactory, ILogger<ChatService> logger, IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task HandleWebSocketConnection(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        WebSocketReceiveResult result;
        string userEmail = null;

        try
        {
            // 处理 WebSocket 连接的初始认证
            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            var authMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
            var authData = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthMessage>(authMessage);

            if (authData.Type == "auth")
            {
                userEmail = await ValidateTokenAndGetUserEmail(authData.Token);

                if (userEmail == null)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Invalid token", CancellationToken.None);
                    return;
                }

                if (_connectedSockets.TryAdd(webSocket, userEmail))
                {
                    Console.WriteLine($"User added: {userEmail}. Total count: {_connectedSockets.Count}");
                }
                else
                {
                    Console.WriteLine($"Failed to add user: {userEmail}. User might already be connected.");
                }
            }
            else
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Invalid auth message", CancellationToken.None);
                return;
            }

            // 处理消息
            while (webSocket.State == WebSocketState.Open)
            {
                try
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var messageContent = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        Console.WriteLine($"Received message: {messageContent}");

                        await BroadcastMessageAsync(messageContent);
                        await SaveMessageAsync(messageContent, userEmail);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        Console.WriteLine("WebSocket connection closed by the client.");
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                    }
                }
                catch (WebSocketException ex)
                {
                    Console.WriteLine($"WebSocketException: {ex.Message}");
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}");
                    break;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Outer Exception: {ex.Message}");
        }
        finally
        {
            // 处理 WebSocket 关闭
            if (webSocket.State == WebSocketState.Open ||
                webSocket.State == WebSocketState.CloseReceived ||
                webSocket.State == WebSocketState.CloseSent)
            {
                try
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.InternalServerError, "Internal Server Error", CancellationToken.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error closing WebSocket: {ex.Message}");
                }
            }

            // 只在 WebSocket 连接存在时才尝试移除
            if (_connectedSockets.ContainsKey(webSocket))
            {
                if (_connectedSockets.TryRemove(webSocket, out var removedUserEmail))
                {
                    Console.WriteLine($"User removed: {removedUserEmail}. Total count: {_connectedSockets.Count}");
                }
                else
                {
                    Console.WriteLine("Failed to remove user. WebSocket might not be present.");
                }
            }

            webSocket.Dispose();
        }
    }

    private async Task BroadcastMessageAsync(string messageContent)
    {
        var buffer = Encoding.UTF8.GetBytes(messageContent);
        var segment = new ArraySegment<byte>(buffer);

        foreach (var socket in _connectedSockets.Keys.ToList())
        {
            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }

    public int GetConnectedUserCount()
    {
        return _connectedSockets.Count;
    }

    private async Task SaveMessageAsync(string message, string email)
    {
        // 解析 JSON 数据
        var jsonDocument = JsonDocument.Parse(message);
        var messageJson = jsonDocument.RootElement;
        // 提取所需字段
        var userName = messageJson.GetProperty("userName").GetString();
        var content = messageJson.GetProperty("content").GetString();
        var createdAt = messageJson.GetProperty("createdAt").GetDateTime();
        Console.WriteLine($"User: {userName}, Content: {content}, CreatedAt: {createdAt}");

        var chatMessage = new ChatMessage
        {
            UserName = userName,
            Content = content,
            CreatedAt = createdAt
        };

        using (var scope = _scopeFactory.CreateScope())
        {
            var messageService = scope.ServiceProvider.GetRequiredService<MessageService>();
            await messageService.SendMessageAsync(chatMessage, email);
            Console.WriteLine("Message saved to database.");
        }
    }

    private async Task<string> ValidateTokenAndGetUserEmail(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtTokenSettings")["SymmetricSecurityKey"]);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration.GetSection("JwtTokenSettings")["ValidIssuer"],
            ValidAudience = _configuration.GetSection("JwtTokenSettings")["ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            var userEmail = principal.FindFirst(ClaimTypes.Email);
            Console.WriteLine($"Email claim: {userEmail?.Value}");
            return userEmail?.Value;
        }
        catch (SecurityTokenExpiredException ex)
        {
            Console.WriteLine($"Token expired: {ex.Message}");
            return null;
        }
        catch (SecurityTokenInvalidSignatureException ex)
        {
            Console.WriteLine($"Invalid token signature: {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return null;
        }
    }

    private class AuthMessage
    {
        public string Type { get; set; }
        public string Token { get; set; }
    }
}
