using MecaProApi.DTOs.Post;

namespace MecaProApi.Services.Interfaces;

public interface IPostService
{
    Task<List<PostDto>> GetAll(Guid? currentUserId);
    Task<List<PostDto>> GetByGarage(Guid garageId, Guid? currentUserId);
    Task<PostDto?> GetById(Guid id, Guid? currentUserId);
    Task<PostDto> Create(Guid userId, CreatePostDto dto);
    Task<bool> Delete(Guid id, Guid userId);
    Task<bool> ToggleLike(Guid postId, Guid userId);
    Task<List<PostCommentDto>> GetComments(Guid postId);
    Task<PostCommentDto> AddComment(Guid postId, Guid userId, CreatePostCommentDto dto);
    Task<bool> DeleteComment(Guid commentId, Guid userId);
}