using material_vender_api.Models.Database;
using material_vender_api.Repository.Contracts;
using Microsoft.EntityFrameworkCore;

namespace material_vender_api.Repository.Implementations
{
    public class MaterialService : IMaterialService
    {
        private readonly DatabaseContext _context;

        public MaterialService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Material>> GetAllMaterialsAsync()
        {
            return await _context.Materials.ToListAsync();
        }

        public async Task<string> GetNextMaterialCodeAsync()
        {
            var lastMaterial = await _context.Materials
                                       .OrderBy(m => m.Id)
                                       .LastOrDefaultAsync();

            int newMaterialId = lastMaterial?.Id + 1 ?? 1;

            string newMaterialCode = $"MAT{newMaterialId:D3}";

            return newMaterialCode;
        }


        public async Task<Material> GetMaterialByIdAsync(int id)
        {
            return await _context.Materials.FindAsync(id);
        }

        public async Task<Material> AddMaterialAsync(Material material)
        {
            _context.Materials.Add(material);
            await _context.SaveChangesAsync();
            return material;
        }

        public async Task<bool> AddBulkMaterialsAsync(List<Material> materials)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                await _context.Materials.AddRangeAsync(materials);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            return true;
        }

        public async Task<bool> UpdateMaterialAsync(int id, Material material)
        {
            if (id != material.Id)
            {
                return false;
            }

            _context.Entry(material).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await MaterialExistsAsync(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<bool> DeleteMaterialAsync(int id)
        {
            var material = await _context.Materials.FindAsync(id);
            if (material == null)
            {
                return false;
            }

            _context.Materials.Remove(material);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MaterialExistsAsync(int id)
        {
            return await _context.Materials.AnyAsync(e => e.Id == id);
        }
    }
}
