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
        // handle message
        public async Task SendMessage(ChatMessage chatMessage)
        {
            var userEmail = Context.User.FindFirstValue(ClaimTypes.Email);
            Console.WriteLine($"User email: {userEmail}");
            if (userEmail == null)
            {
                await Clients.Caller.SendAsync("Error", "User email not found.");
                return;
            }

            try
            {
                var message = await _messageService.SendMessageAsync(chatMessage, userEmail);
                Console.WriteLine($"Message sent saved: {message.Content}");
                await Clients.All.SendAsync("ReceiveMessage", chatMessage);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", $"Failed to send message: {ex.Message}");
            }
        }

        // load messages
        public async Task LoadMessages()
        {
            try
            {
                // load messages
                var messages = await _messageService.LoadTodayMessagesAsync();
                Console.WriteLine($"Loaded {messages} messages");

                await Clients.Caller.SendAsync("LoadMessages", messages);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", $"Failed to load messages: {ex.Message}");
            }
        }
    }
}
