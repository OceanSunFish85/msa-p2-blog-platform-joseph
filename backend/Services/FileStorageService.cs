// namespace backend.Services{
//     public class LocalFileStorageService
// {
//     private readonly string _articleMediaPath;

//     public LocalFileStorageService(IConfiguration configuration)
//     {
//         _articleMediaPath = configuration["FileStorage:ArticleMediaPath"];
//     }

//     public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
//     {
//         var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
//         var filePath = Path.Combine(_articleMediaPath, uniqueFileName);
//         Directory.CreateDirectory(_articleMediaPath); // Ensure the directory exists
//         using (var fileStreamOutput = new FileStream(filePath, FileMode.Create))
//         {
//             await fileStream.CopyToAsync(fileStreamOutput);
//         }
//         return $"/uploads/{uniqueFileName}"; // Return the relative path for web access
//     }
// }
// }