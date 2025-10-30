using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using financas_backend.Models;

namespace financas_backend.DTOs
{
    public class CategoriaCreateDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(50)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tipo é obrigatório")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }

        [MaxLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Cor deve estar no formato hexadecimal (#RRGGBB)")]
        public string Cor { get; set; } = "#3B82F6";

        [MaxLength(50)]
        public string Icone { get; set; } = "tag";
    }

    public class CategoriaUpdateDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(50)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Cor deve estar no formato hexadecimal (#RRGGBB)")]
        public string Cor { get; set; } = "#3B82F6";

        [MaxLength(50)]
        public string Icone { get; set; } = "tag";

        public bool Ativo { get; set; } = true;
    }

    public class CategoriaResponseDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }
        public string Cor { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}