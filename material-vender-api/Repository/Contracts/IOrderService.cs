using material_vender_api.Models.Database;
using material_vender_api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace material_vender_api.Repository.Contracts
{
    public interface IOrderService
    {
        Task<IEnumerable<PurchaseOrder>> GetAllPurchaseOrdersAsync();
        Task<OrderDTO> GetPurchaseOrderByIdAsync(int id);
        Task<string> GetNextOrderCodeAsync();
        Task<PurchaseOrder> AddPurchaseOrderAsync(OrderDTO orderDto);
        Task<bool> UpdatePurchaseOrderAsync(int id, OrderDTO orderDto);
        Task<bool> DeletePurchaseOrderAsync(int id);
        Task<bool> PurchaseOrderExistsAsync(int id);
    }
}
