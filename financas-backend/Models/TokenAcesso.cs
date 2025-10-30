using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace financas_backend.Models
{
    public class TokenAcesso
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [Required]
        [MaxLength(500)]
        public string RefreshToken { get; set; } = string.Empty;

        [Required]
        public DateTime DataExpiracao { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public bool Revogado { get; set; } = false;

        public DateTime? DataRevogacao { get; set; }

        [MaxLength(45)]
        public string? IpAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        // Relacionamento
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;
    }
}