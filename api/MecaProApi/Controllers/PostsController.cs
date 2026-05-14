using System.Security.Claims;
using MecaProApi.DTOs.Post;
using MecaProApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MecaProApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim) : null;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _postService.GetAll(GetUserId());
        return Ok(posts);
    }

    [HttpGet("garage/{garageId}")]
    public async Task<IActionResult> GetByGarage(Guid garageId)
    {
        var posts = await _postService.GetByGarage(garageId, GetUserId());
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var post = await _postService.GetById(id, GetUserId());
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreatePostDto dto)
    {
        var post = await _postService.Create(GetUserId()!.Value, dto);
        return Ok(post);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _postService.Delete(id, GetUserId()!.Value);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("{id}/like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var liked = await _postService.ToggleLike(id, GetUserId()!.Value);
        return Ok(new { liked });
    }

    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(Guid id)
    {
        var comments = await _postService.GetComments(id);
        return Ok(comments);
    }

    [HttpPost("{id}/comments")]
    [Authorize]
    public async Task<IActionResult> AddComment(Guid id, CreatePostCommentDto dto)
    {
        var comment = await _postService.AddComment(id, GetUserId()!.Value, dto);
        return Ok(comment);
    }

    [HttpDelete("{id}/comments/{commentId}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(Guid id, Guid commentId)
    {
        var result = await _postService.DeleteComment(commentId, GetUserId()!.Value);
        if (!result) return NotFound();
        return Ok();
    }
}