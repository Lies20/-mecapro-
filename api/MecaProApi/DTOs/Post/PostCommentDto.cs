namespace MecaProApi.DTOs.Post;

public class PostCommentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreatePostCommentDto
{
    public string Content { get; set; } = string.Empty;
}