using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.Models;
using backend.Services;

namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly MessageService _messageService;

        public ChatHub(MessageService messageService)
        {
            _messageService = messageService;
        }
        // 处理接收到的消息并广播给所有连接的客户端
        public async Task SendMessage(ChatMessage chatMessage)
        {
            var userEmail = Context.User.FindFirstValue(ClaimTypes.Email);
            Console.WriteLine($"User email: {userEmail}"); // 调试信息
            if (userEmail == null)
            {
                await Clients.Caller.SendAsync("Error", "User email not found.");
                return;
            }

            try
            {
                var message = await _messageService.SendMessageAsync(chatMessage, userEmail);
                Console.WriteLine($"Message sent saved: {message.Content}"); // 调试信息
                await Clients.All.SendAsync("ReceiveMessage", chatMessage);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", $"Failed to send message: {ex.Message}");
            }
        }

        // 加载消息
        public async Task LoadMessages()
        {
            try
            {
                // 从服务中获取消息
                var messages = await _messageService.LoadTodayMessagesAsync();
                Console.WriteLine($"Loaded {messages} messages"); // 调试信息

                await Clients.Caller.SendAsync("LoadMessages", messages);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", $"Failed to load messages: {ex.Message}");
            }
        }
    }
}
