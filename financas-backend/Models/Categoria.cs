using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace financas_backend.Models
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public TipoTransacao Tipo { get; set; }

        [MaxLength(7)]
        public string Cor { get; set; } = "#3B82F6";

        [MaxLength(50)]
        public string Icone { get; set; } = "tag";

        [Required]
        public int UsuarioId { get; set; }

        public bool Ativo { get; set; } = true;

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        // Relacionamentos
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }

    public enum TipoTransacao
    {
        Receita,
        Despesa
    }
}