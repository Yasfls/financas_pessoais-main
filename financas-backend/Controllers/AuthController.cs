using financas_backend.Data;
using financas_backend.DTOs;
using financas_backend.Helpers;
using financas_backend.Models;
using financas_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace financas_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, AuthService authService, IConfiguration configuration)
        {
            _context = context;
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegisterDTO registerDto)
        {
            // Verifica se email já existe
            if (await _context.Usuarios.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email já cadastrado" });
            }

            // Cria o usuário
            var salt = HashHelper.GenerateSalt();
            var usuario = new Usuario
            {
                Nome = registerDto.Nome,
                Email = registerDto.Email,
                Salt = salt,
                PasswordHash = HashHelper.HashPassword(registerDto.Password, salt),
                EmailConfirmado = true // Por enquanto, sem confirmação de email
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Gera tokens
            var token = _authService.GenerateJwtToken(usuario);
            var refreshToken = _authService.GenerateRefreshToken();

            // Salva refresh token
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var refreshTokenExpiration = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

            var tokenAcesso = new TokenAcesso
            {
                UsuarioId = usuario.Id,
                RefreshToken = refreshToken,
                DataExpiracao = DateTime.UtcNow.AddDays(refreshTokenExpiration),
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers["User-Agent"].ToString()
            };

            _context.TokensAcesso.Add(tokenAcesso);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDTO
            {
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "60")),
                Usuario = new UsuarioDTO
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            // Verifica se conta está bloqueada
            if (usuario.ContaBloqueada)
            {
                return Unauthorized(new { message = "Conta bloqueada. Contate o suporte." });
            }

            // Verifica senha
            if (!HashHelper.VerifyPassword(loginDto.Password, usuario.Salt, usuario.PasswordHash))
            {
                // Incrementa tentativas falhadas
                usuario.TentativasLoginFalhadas++;

                if (usuario.TentativasLoginFalhadas >= 5)
                {
                    usuario.ContaBloqueada = true;
                    usuario.DataBloqueio = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            // Reset tentativas falhadas
            usuario.TentativasLoginFalhadas = 0;
            usuario.UltimoLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Gera tokens
            var token = _authService.GenerateJwtToken(usuario);
            var refreshToken = _authService.GenerateRefreshToken();

            // Salva refresh token
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var refreshTokenExpiration = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

            var tokenAcesso = new TokenAcesso
            {
                UsuarioId = usuario.Id,
                RefreshToken = refreshToken,
                DataExpiracao = DateTime.UtcNow.AddDays(refreshTokenExpiration),
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers["User-Agent"].ToString()
            };

            _context.TokensAcesso.Add(tokenAcesso);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDTO
            {
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "60")),
                Usuario = new UsuarioDTO
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email
                }
            });
        }
    }
}