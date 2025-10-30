using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using financas_backend.Models;

namespace financas_backend.DTOs
{
    public class TransacaoCreateDTO
    {
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "Tipo é obrigatório")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "Data é obrigatória")]
        public DateTime Data { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }

        public string? Observacoes { get; set; }

        public bool Recorrente { get; set; } = false;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoRecorrencia? TipoRecorrencia { get; set; }
    }

    public class TransacaoUpdateDTO
    {
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "Tipo é obrigatório")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "Data é obrigatória")]
        public DateTime Data { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }

        public string? Observacoes { get; set; }

        public bool Recorrente { get; set; } = false;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoRecorrencia? TipoRecorrencia { get; set; }
    }

    public class TransacaoResponseDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }
        public DateTime Data { get; set; }
        public int CategoriaId { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;
        public string CategoriaCor { get; set; } = string.Empty;
        public string CategoriaIcone { get; set; } = string.Empty;
        public string? Observacoes { get; set; }
        public bool Recorrente { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoRecorrencia? TipoRecorrencia { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}