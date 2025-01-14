using material_vender_api.Models.Database;

namespace material_vender_api.Repository.Contracts
{
    public interface IOrderService
    {
        Task<IEnumerable<PurchaseOrder>> GetAllPurchaseOrdersAsync();
        Task<PurchaseOrder> GetPurchaseOrderByIdAsync(int id);
        Task<PurchaseOrder> AddPurchaseOrderAsync(PurchaseOrder purchaseOrder);
        Task<bool> UpdatePurchaseOrderAsync(int id, PurchaseOrder purchaseOrder);
        Task<bool> DeletePurchaseOrderAsync(int id);
        Task<bool> PurchaseOrderExistsAsync(int id);
    }
}
