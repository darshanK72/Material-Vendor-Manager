using material_vender_api.Models.Database;
using material_vender_api.Repository.Contracts;
using Microsoft.EntityFrameworkCore;

namespace material_vender_api.Repository.Implementations
{
    public class VendorService : IVendorService
    {
        private readonly DatabaseContext _context;

        public VendorService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vendor>> GetAllVendorsAsync()
        {
            return await _context.Vendors
                .Include(v => v.PurchaseOrders)
                .ToListAsync();
        }

        public async Task<Vendor> GetVendorByIdAsync(int id)
        {
            return await _context.Vendors
                .Include(v => v.PurchaseOrders)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vendor> AddVendorAsync(Vendor vendor)
        {
            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();
            return vendor;
        }

        public async Task<string> GetNextVendorCodeAsync()
        {
            var lastVendor = await _context.Vendors
                                       .OrderBy(m => m.Id)
                                       .LastOrDefaultAsync();

            int newVendorId = lastVendor?.Id + 1 ?? 1;

            string newVendorCode = $"VD{newVendorId:D4}";

            return newVendorCode;
        }

        public async Task<bool> AddBulkVendorsAsync(List<Vendor> vendors)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                await _context.Vendors.AddRangeAsync(vendors);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            return true;
        }

        public async Task<bool> UpdateVendorAsync(int id, Vendor vendor)
        {
            if (id != vendor.Id)
            {
                return false;
            }

            _context.Entry(vendor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await VendorExistsAsync(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<bool> DeleteVendorAsync(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor == null)
            {
                return false;
            }

            _context.Vendors.Remove(vendor);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> VendorExistsAsync(int id)
        {
            return await _context.Vendors.AnyAsync(v => v.Id == id);
        }
    }
}
