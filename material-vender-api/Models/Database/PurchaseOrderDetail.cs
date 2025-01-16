using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace material_vender_api.Models.Database
{
    public class PurchaseOrderDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public PurchaseOrder? PurchaseOrder { get; set; }

        [Required]
        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }

        [Required]
        public int ItemQuantity { get; set; }

        [Required]
        public decimal ItemRate { get; set; }

        [Required]
        public decimal ItemValue { get; set; }

        [StringLength(500)]
        public string? ItemNotes { get; set; }

        public DateTime? ExpectedDate { get; set; }
    }
}
