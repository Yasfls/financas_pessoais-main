using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace financas_backend.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Salt { get; set; } = string.Empty;

        public bool EmailConfirmado { get; set; } = false;

        [MaxLength(255)]
        public string? TokenConfirmacaoEmail { get; set; }

        [MaxLength(255)]
        public string? TokenResetSenha { get; set; }

        public DateTime? DataExpiracaoTokenReset { get; set; }

        public int TentativasLoginFalhadas { get; set; } = 0;

        public bool ContaBloqueada { get; set; } = false;

        public DateTime? DataBloqueio { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

        public DateTime? UltimoLogin { get; set; }

        // Relacionamentos
        public virtual ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
        public virtual ICollection<TokenAcesso> TokensAcesso { get; set; } = new List<TokenAcesso>();
    }
}