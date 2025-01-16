using material_vender_api.Models.Database;

namespace material_vender_api.Repository.Contracts
{
    public interface IVendorService
    {
        Task<IEnumerable<Vendor>> GetAllVendorsAsync();
        Task<string> GetNextVendorCodeAsync();
        Task<Vendor> GetVendorByIdAsync(int id);
        Task<Vendor> AddVendorAsync(Vendor vendor);
        Task<bool> AddBulkVendorsAsync(List<Vendor> vendors);
        Task<bool> UpdateVendorAsync(int id, Vendor vendor);
        Task<bool> DeleteVendorAsync(int id);
        Task<bool> VendorExistsAsync(int id);
    }
}
