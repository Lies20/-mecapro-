using MecaProApi.Data;
using MecaProApi.DTOs.Post;
using MecaProApi.Models;
using MecaProApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MecaProApi.Services;

public class PostService : IPostService
{
    private readonly AppDbContext _db;

    public PostService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<PostDto>> GetAll(Guid? currentUserId)
    {
        var posts = await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Garage)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(p => ToDto(p, currentUserId)).ToList();
    }

    public async Task<List<PostDto>> GetByGarage(Guid garageId, Guid? currentUserId)
    {
        var posts = await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Garage)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Where(p => p.GarageId == garageId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(p => ToDto(p, currentUserId)).ToList();
    }

    public async Task<PostDto?> GetById(Guid id, Guid? currentUserId)
    {
        var post = await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Garage)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);

        return post == null ? null : ToDto(post, currentUserId);
    }

    public async Task<PostDto> Create(Guid userId, CreatePostDto dto)
    {
        var post = new Post
        {
            UserId = userId,
            GarageId = dto.GarageId,
            AppointmentId = dto.AppointmentId,
            Caption = dto.Caption,
            MediaUrl = dto.MediaUrl,
            MediaType = dto.MediaType
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        return ToDto(await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Garage)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .FirstAsync(p => p.Id == post.Id), userId);
    }

    public async Task<bool> Delete(Guid id, Guid userId)
    {
        var post = await _db.Posts
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (post == null) return false;

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleLike(Guid postId, Guid userId)
    {
        var like = await _db.PostLikes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (like != null)
        {
            _db.PostLikes.Remove(like);
        }
        else
        {
            _db.PostLikes.Add(new PostLike
            {
                PostId = postId,
                UserId = userId
            });
        }

        await _db.SaveChangesAsync();
        return like == null;
    }

    public async Task<List<PostCommentDto>> GetComments(Guid postId)
    {
        var comments = await _db.PostComments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();

        return comments.Select(c => new PostCommentDto
        {
            Id = c.Id,
            UserId = c.UserId,
            UserFirstName = c.User?.FirstName ?? string.Empty,
            Content = c.Content,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<PostCommentDto> AddComment(Guid postId, Guid userId, CreatePostCommentDto dto)
    {
        var comment = new PostComment
        {
            PostId = postId,
            UserId = userId,
            Content = dto.Content
        };

        _db.PostComments.Add(comment);
        await _db.SaveChangesAsync();

        return new PostCommentDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserFirstName = (await _db.Users.FindAsync(userId))?.FirstName ?? string.Empty,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<bool> DeleteComment(Guid commentId, Guid userId)
    {
        var comment = await _db.PostComments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);

        if (comment == null) return false;

        _db.PostComments.Remove(comment);
        await _db.SaveChangesAsync();
        return true;
    }

    private static PostDto ToDto(Post p, Guid? currentUserId) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        UserFirstName = p.User?.FirstName ?? string.Empty,
        GarageId = p.GarageId,
        GarageName = p.Garage?.Name ?? string.Empty,
        AppointmentId = p.AppointmentId,
        Caption = p.Caption,
        MediaUrl = p.MediaUrl,
        MediaType = p.MediaType,
        LikesCount = p.Likes.Count,
        CommentsCount = p.Comments.Count,
        IsLikedByMe = currentUserId.HasValue &&
                      p.Likes.Any(l => l.UserId == currentUserId.Value),
        CreatedAt = p.CreatedAt
    };
}