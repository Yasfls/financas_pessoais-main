using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace financas_backend.Models
{
    public class Transacao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(15,2)")]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Required]
        public DateTime Data { get; set; }

        [Required]
        public int CategoriaId { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        public string? Observacoes { get; set; }

        public bool Recorrente { get; set; } = false;

        public TipoRecorrencia? TipoRecorrencia { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

        // Relacionamentos
        [ForeignKey("CategoriaId")]
        public virtual Categoria Categoria { get; set; } = null!;

        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<Anexo> Anexos { get; set; } = new List<Anexo>();
    }

    public enum TipoRecorrencia
    {
        Diaria,
        Semanal,
        Mensal,
        Anual
    }
}