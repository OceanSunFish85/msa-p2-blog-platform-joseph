using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace backend.Services
{


    public class FileStorageService
    {
        private readonly string _uploadPath;
        private readonly string _articleMediaPath;
        private readonly string _avatarPath;
        private readonly string _coverPath;
        private readonly string _baseUrl;

        public FileStorageService(IConfiguration configuration)
        {
            _uploadPath = configuration["FileStorage:UploadPath"] ?? "default/upload/path";
            _articleMediaPath = configuration["FileStorage:ArticleMediaPath"] ?? "default/article/media/path";
            _avatarPath = configuration["FileStorage:AvatarPath"] ?? "default/avatar/path";
            _coverPath = configuration["FileStorage:CoverPath"] ?? "default/cover/path";
            _baseUrl = configuration["FileStorage:BaseUrl"] ?? "http://localhost:5078";
        }

        public async Task<string> UploadAvatarAsync(IFormFile file)
        {
            var filePath = Path.Combine(_avatarPath, $"{Guid.NewGuid()}_{file.FileName}");
            Directory.CreateDirectory(_avatarPath);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"{_baseUrl}/uploads/avatar/{Path.GetFileName(filePath)}"; // 返回包含 base URL 的路径
        }

        public async Task<string> UploadCoverAsync(IFormFile file)
        {
            var filePath = Path.Combine(_coverPath, $"{Guid.NewGuid()}_{file.FileName}");
            Directory.CreateDirectory(_coverPath);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"{_baseUrl}/uploads/cover/{Path.GetFileName(filePath)}"; // 返回包含 base URL 的路径
        }

        public async Task<List<string>> UploadArticleMediaAsync(List<IFormFile> files)
        {
            var urls = new List<string>();

            foreach (var file in files)
            {
                var filePath = Path.Combine(_articleMediaPath, $"{Guid.NewGuid()}_{file.FileName}");
                Directory.CreateDirectory(_articleMediaPath);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                urls.Add($"{_baseUrl}/uploads/article-media/{Path.GetFileName(filePath)}"); // Modify this line to include base URL
            }

            return urls;
        }

        private static async Task<string> SaveFileAsync(IFormFile file, string path)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded");

            var fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(path, fileName);

            Directory.CreateDirectory(path);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("/", path, fileName).Replace("\\", "/");
        }
    }
}