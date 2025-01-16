using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace material_vender_api.Models.DTOs
{
    public class MaterialDTO
    {
        public int? Id { get; set; }

        [Required]
        public string? Code { get; set; }

        [Required]
        public string? ShortText { get; set; }

        public string? LongText { get; set; }

        [Required]
        public string? Unit { get; set; }

        public int ReorderLevel { get; set; }

        public int MinOrderQuantity { get; set; }

        public bool IsActive { get; set; }
    }
}
