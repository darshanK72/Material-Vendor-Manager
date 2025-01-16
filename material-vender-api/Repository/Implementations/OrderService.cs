using material_vender_api.Models.Database;
using material_vender_api.Repository.Contracts;
using Microsoft.EntityFrameworkCore;
using material_vender_api.Models.DTOs;

namespace material_vender_api.Repository.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly DatabaseContext _context;

        public OrderService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllPurchaseOrdersAsync()
        {
            return await _context.PurchaseOrders
                .Include(po => po.Vendor)
                .Include(po => po.PurchaseOrderDetails)
                .ToListAsync();
        }

        public async Task<OrderDTO> GetPurchaseOrderByIdAsync(int id)
        {
            var purchaseOrder =  await _context.PurchaseOrders
                .Include(po => po.Vendor)
                .FirstOrDefaultAsync(po => po.Id == id);

            if (purchaseOrder == null) { return null; }

            var orderDetails = await _context.PurchaseOrderDetails.Where(pod => pod.OrderId == id).Include(o => o.Material).ToListAsync();

            purchaseOrder.PurchaseOrderDetails = orderDetails;

            var orderDto = new OrderDTO
            {
                OrderNumber = purchaseOrder.OrderNumber,
                OrderDate = purchaseOrder.OrderDate,
                VendorId = purchaseOrder.VendorId,
                Notes = purchaseOrder.Notes,
                OrderValue = purchaseOrder.OrderValue,
                OrderStatus = purchaseOrder.OrderStatus,
                PurchaseOrderDetails = orderDetails.Select(od => new OrderDetailDTO()
                {
                    Id = od.Id,
                    MaterialId = od.MaterialId,
                    ItemQuantity = od.ItemQuantity,
                    ItemRate = od.ItemRate,
                    ItemValue = od.ItemValue,
                    ItemNotes = od.ItemNotes,
                    ExpectedDate = od.ExpectedDate,
                    Code = od?.Material?.Code,
                    Unit = od?.Material?.Unit,
                    ShortText = od?.Material?.ShortText

                }).ToList(),
            };


            return orderDto; 

        }

        public async Task<PurchaseOrder> AddPurchaseOrderAsync(OrderDTO orderDto)
        {
            if (orderDto == null)
                throw new ArgumentNullException(nameof(orderDto));

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var purchaseOrder = new PurchaseOrder
                {
                    OrderNumber = orderDto.OrderNumber,
                    OrderDate = orderDto.OrderDate,
                    VendorId = orderDto.VendorId,
                    Notes = orderDto.Notes,
                    OrderValue = orderDto.OrderValue,
                    OrderStatus = orderDto.OrderStatus,
                    PurchaseOrderDetails = orderDto.PurchaseOrderDetails?.Select(detailDto => new PurchaseOrderDetail
                    {
                        MaterialId = detailDto.MaterialId,
                        ItemQuantity = detailDto.ItemQuantity,
                        ItemRate = detailDto.ItemRate,
                        ItemValue = detailDto.ItemValue,
                        ItemNotes = detailDto.ItemNotes,
                        ExpectedDate = detailDto.ExpectedDate
                    }).ToList()
                };

                // Save the PurchaseOrder
                await _context.PurchaseOrders.AddAsync(purchaseOrder);
                await _context.SaveChangesAsync();

                // PurchaseOrder.Id will now be generated after SaveChangesAsync
                if (purchaseOrder.PurchaseOrderDetails != null && purchaseOrder.PurchaseOrderDetails.Any())
                {
                    // Set the OrderId for each PurchaseOrderDetail
                    foreach (var detail in purchaseOrder.PurchaseOrderDetails)
                    {
                        detail.OrderId = purchaseOrder.Id ?? 0;
                    }

                    // Save the PurchaseOrderDetails
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return purchaseOrder;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw; // Re-throw the exception to the caller
            }
        }


        public async Task<bool> UpdatePurchaseOrderAsync(int id, OrderDTO orderDto)
        {
            if (orderDto == null)
                throw new ArgumentNullException(nameof(orderDto));

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingOrder = await _context.PurchaseOrders
                    .Include(p => p.PurchaseOrderDetails)
                    .FirstOrDefaultAsync(po => po.Id == id);

                existingOrder.OrderNumber = orderDto.OrderNumber;
                existingOrder.OrderDate = orderDto.OrderDate;
                existingOrder.VendorId = orderDto.VendorId;
                existingOrder.Notes = orderDto.Notes;
                existingOrder.OrderValue = orderDto.OrderValue;
                existingOrder.OrderStatus = orderDto.OrderStatus;

                // Update PurchaseOrderDetails
                var newDetails = orderDto.PurchaseOrderDetails ?? new List<OrderDetailDTO>();

                // Delete removed details
                var detailIds = newDetails.Select(d => d.Id).ToList();
                var detailsToDelete = existingOrder.PurchaseOrderDetails
                    .Where(d => !detailIds.Contains(d?.Id))
                    .ToList();

                _context.PurchaseOrderDetails.RemoveRange(detailsToDelete);

                // Update or add details
                foreach (var detailDto in newDetails)
                {
                    var existingDetail = existingOrder.PurchaseOrderDetails
                        .FirstOrDefault(d => d.Id == detailDto.Id);

                    if (existingDetail != null)
                    {
                        existingDetail.MaterialId = detailDto.MaterialId;
                        existingDetail.ItemQuantity = detailDto.ItemQuantity;
                        existingDetail.ItemRate = detailDto.ItemRate;
                        existingDetail.ItemValue = detailDto.ItemValue;
                        existingDetail.ItemNotes = detailDto.ItemNotes;
                        existingDetail.ExpectedDate = detailDto.ExpectedDate;
                    }
                    else
                    {
                        var newDetail = new PurchaseOrderDetail
                        {
                            OrderId = id,
                            MaterialId = detailDto.MaterialId,
                            ItemQuantity = detailDto.ItemQuantity,
                            ItemRate = detailDto.ItemRate,
                            ItemValue = detailDto.ItemValue,
                            ItemNotes = detailDto.ItemNotes,
                            ExpectedDate = detailDto.ExpectedDate
                        };

                        existingOrder.PurchaseOrderDetails.Add(newDetail);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeletePurchaseOrderAsync(int id)
        {
            var purchaseOrder = await _context.PurchaseOrders.FindAsync(id);
            if (purchaseOrder == null)
            {
                return false;
            }

            _context.PurchaseOrders.Remove(purchaseOrder);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PurchaseOrderExistsAsync(int id)
        {
            return await _context.PurchaseOrders.AnyAsync(po => po.Id == id);
        }
    }
}
