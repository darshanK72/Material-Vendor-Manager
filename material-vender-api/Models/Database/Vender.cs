using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace material_vender_api.Models.Database
{
    public class Vendor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string? Code { get; set; }

        [Required]
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(200)]
        public string? AddressLine1 { get; set; }

        [StringLength(200)]
        public string? AddressLine2 { get; set; }

        [EmailAddress]
        public string? ContactEmail { get; set; }

        [Phone]
        public string? ContactNo { get; set; }

        public DateTime? ValidTillDate { get; set; }

        public bool IsActive { get; set; }

        [JsonIgnore]
        public ICollection<PurchaseOrder>? PurchaseOrders { get; set; }
    }
}
