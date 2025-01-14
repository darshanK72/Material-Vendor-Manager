using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace material_vender_api.Models.Database
{
    public class PurchaseOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string? OrderNumber { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        public int VendorId { get; set; }

        [ForeignKey("VendorId")]
        public Vendor? Vendor { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public decimal OrderValue { get; set; }

        [Required]
        [StringLength(50)]
        public string? OrderStatus { get; set; }

        [JsonIgnore]
        public ICollection<PurchaseOrderDetail>? PurchaseOrderDetails { get; set; }
    }
}
