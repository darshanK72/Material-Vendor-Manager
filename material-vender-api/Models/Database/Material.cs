using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace material_vender_api.Models.Database
{
    public class Material
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        [StringLength(50)]
        public string? Code { get; set; }

        [Required]
        [StringLength(100)]
        public string? ShortText { get; set; }

        [StringLength(500)]
        public string? LongText { get; set; }

        [Required]
        public string? Unit { get; set; }

        public int ReorderLevel { get; set; }

        public int MinOrderQuantity { get; set; }

        public bool IsActive { get; set; }
    }

}
