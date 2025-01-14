using material_vender_api.Models.Database;
using material_vender_api.Models.Responses;
using material_vender_api.Repository.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace material_vender_api.Controllers
{
    [Route("api/vendors")]
    [ApiController]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors()
        {
            var vendors = await _vendorService.GetAllVendorsAsync();
            return Ok(vendors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vendor>> GetVendor([FromRoute] int id)
        {
            var vendor = await _vendorService.GetVendorByIdAsync(id);

            if (vendor == null)
            {
                return NotFound(new ErrorResponse()
                {
                    ErrorMessage = $"Vendor with Id {id} not found."
                });
            }

            return Ok(vendor);
        }

        [HttpPost]
        public async Task<ActionResult<Vendor>> PostVendor(Vendor vendor)
        {
            var createdVendor = await _vendorService.AddVendorAsync(vendor);

            if (createdVendor == null)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = "Failed to create new vendor."
                });
            }

            return CreatedAtAction("GetVendor", new { id = createdVendor.Id }, createdVendor);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> PutVendor(int id, Vendor vendor)
        {
            var result = await _vendorService.UpdateVendorAsync(id, vendor);

            if (!result)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = $"Failed to update vendor with Id {id}."
                });
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteVendor(int id)
        {
            var result = await _vendorService.DeleteVendorAsync(id);

            if (!result)
            {
                return NotFound(new ErrorResponse()
                {
                    ErrorMessage = $"Failed to delete vendor with Id {id}."
                });
            }

            return Ok(result);
        }
    }
}
