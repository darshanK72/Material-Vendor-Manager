namespace material_vender_api.Models.DTOs
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class OrderDTO
        {
           public int? Id { get; set; }  
            [Required]
            [StringLength(50)]
            public string? OrderNumber { get; set; }

            [Required]
            public DateTime OrderDate { get; set; }

            [Required]
            public int VendorId { get; set; }

            [StringLength(500)]
            public string? Notes { get; set; }

            [Required]
            public decimal OrderValue { get; set; }

            [Required]
            [StringLength(50)]
            public string? OrderStatus { get; set; }

            public List<OrderDetailDTO>? PurchaseOrderDetails { get; set; }
        }

        public class OrderDetailDTO
        {
        public int? Id { get; set; }
        [Required]
            public int MaterialId { get; set; }

            [Required]
            public string? Code { get; set; }

            [Required]
            public string? Unit { get; set; }

            [Required]
            public string? ShortText { get; set; }

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


