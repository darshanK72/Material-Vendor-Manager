using material_vender_api.Models.Database;

namespace material_vender_api.Repository.Contracts
{
    public interface IMaterialService
    {
        Task<IEnumerable<Material>> GetAllMaterialsAsync();
        Task<Material> GetMaterialByIdAsync(int id);
        Task<Material> AddMaterialAsync(Material material);
        Task<bool> UpdateMaterialAsync(int id, Material material);
        Task<bool> DeleteMaterialAsync(int id);
        Task<bool> MaterialExistsAsync(int id);
    }
}
