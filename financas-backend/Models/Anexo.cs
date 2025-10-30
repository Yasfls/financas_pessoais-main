using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace financas_backend.Models
{
    public class Anexo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TransacaoId { get; set; }

        [Required]
        [MaxLength(255)]
        public string NomeArquivo { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string NomeArquivoOriginal { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string CaminhoArquivo { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string TipoMime { get; set; } = string.Empty;

        [Required]
        public long TamanhoBytes { get; set; }

        [Required]
        [MaxLength(64)]
        public string HashArquivo { get; set; } = string.Empty;

        public DateTime DataUpload { get; set; } = DateTime.UtcNow;

        // Relacionamento
        [ForeignKey("TransacaoId")]
        public virtual Transacao Transacao { get; set; } = null!;
    }
}