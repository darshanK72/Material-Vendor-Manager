using material_vender_api.Models.Database;

namespace material_vender_api.Repository.Contracts
{
    public interface IMaterialService
    {
        Task<IEnumerable<Material>> GetAllMaterialsAsync();
        Task<Material> GetMaterialByIdAsync(int id);
        Task<string> GetNextMaterialCodeAsync();
        Task<Material> AddMaterialAsync(Material material);
        Task<bool> AddBulkMaterialsAsync(List<Material> materials);
        Task<bool> UpdateMaterialAsync(int id, Material material);
        Task<bool> DeleteMaterialAsync(int id);
        Task<bool> MaterialExistsAsync(int id);
    }
}
