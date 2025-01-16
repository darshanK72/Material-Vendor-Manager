using material_vender_api.Models.Database;
using material_vender_api.Models.Responses;
using material_vender_api.Repository.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace material_vender_api.Controllers
{
    [Route("api/materials")]
    [ApiController]
    public class MaterialsController : ControllerBase
    {
        private readonly IMaterialService _materialService;

        public MaterialsController(IMaterialService materialService)
        {
            _materialService = materialService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Material>>> GetMaterials()
        {
            var materials = await _materialService.GetAllMaterialsAsync();
            return Ok(materials);
        }

        [HttpGet("next-material-code")]
        public async Task<ActionResult<CodeResponse>> GetMaterialNextCode()
        {
            var code = await _materialService.GetNextMaterialCodeAsync();
            return Ok(new CodeResponse()
            {
                Code = code,
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Material>> GetMaterial([FromRoute] int id)
        {
            var material = await _materialService.GetMaterialByIdAsync(id);

            if (material == null)
            {
                return NotFound(new ErrorResponse() 
                { 
                    ErrorMessage = $"Material with Id {id} not found."
                });
            }

            return Ok(material);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> PutMaterial(int id, Material material)
        {
            var result = await _materialService.UpdateMaterialAsync(id, material);

            if (!result)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = $"Failed to update the material with Id {id}."
                });
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Material>> PostMaterial(Material material)
        {
           var createdMaterial = await _materialService.AddMaterialAsync(material);

            if (createdMaterial == null)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = "Failed to create new material."
                });
            }

            return CreatedAtAction("GetMaterial", new { id = createdMaterial.Id }, createdMaterial);
        }

        [HttpPost("bulk-create")]
        public async Task<ActionResult<bool>> PostBulkMaterials(List<Material> materials)
        {
            var result = await _materialService.AddBulkMaterialsAsync(materials);

            if (!result)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = "Failed to create new materials."
                });
            }

            return Ok("Created all materials");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteMaterial(int id)
        {
            var result = await _materialService.DeleteMaterialAsync(id);

            if (!result)
            {
                return NotFound(new ErrorResponse()
                {
                    ErrorMessage = $"Failed to delete the material with Id {id}."
                });
            }

            return Ok(result);
        }
    }
}
