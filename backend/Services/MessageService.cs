using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MessageService
    {
        private readonly BlogWebDbContext _context;

        public MessageService(BlogWebDbContext context)
        {
            _context = context;
        }

        // load messages
        public async Task<List<Message>> LoadTodayMessagesAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Messages
                .Where(m => m.CreatedAt >= today)
                .ToListAsync();
        }

        // send message
        public async Task<Message> SendMessageAsync(ChatMessage chatMessage, string email)
        {

            var UserName = chatMessage.UserName;
            var Content = chatMessage.Content;
            DateTime? CreatedAt = chatMessage.CreatedAt;


            var message = new Message
            {
                UserEmail = email,
                Content = Content!,
                CreatedAt = CreatedAt ?? DateTime.Now,
                UserName = UserName!
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return message;
        }
    }
}