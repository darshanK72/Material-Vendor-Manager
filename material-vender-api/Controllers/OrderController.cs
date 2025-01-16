using material_vender_api.Models.Database;
using material_vender_api.Models.DTOs;
using material_vender_api.Models.Responses;
using material_vender_api.Repository.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace material_vender_api.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public PurchaseOrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrder>>> GetPurchaseOrders()
        {
            var purchaseOrders = await _orderService.GetAllPurchaseOrdersAsync();
            return Ok(purchaseOrders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetPurchaseOrder([FromRoute] int id)
        {
            var purchaseOrder = await _orderService.GetPurchaseOrderByIdAsync(id);

            if (purchaseOrder == null)
            {
                return NotFound(new ErrorResponse() { ErrorMessage = $"Purchase Order with ID {id} not found." });
            }

            return Ok(purchaseOrder);
        }

        [HttpPost]
        public async Task<ActionResult<PurchaseOrder>> PostPurchaseOrder(OrderDTO purchaseOrder)
        {

            var createdPurchaseOrder = await _orderService.AddPurchaseOrderAsync(purchaseOrder);

            if (createdPurchaseOrder == null)
            {
                return BadRequest(new ErrorResponse()
                {
                    ErrorMessage = "Failed to create new purchase order."
                });
            }

            return CreatedAtAction("GetPurchaseOrder", new { id = createdPurchaseOrder.Id }, createdPurchaseOrder);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> PutPurchaseOrder(int id, OrderDTO orderDTO)
        {
            var result = await _orderService.UpdatePurchaseOrderAsync(id, orderDTO);

            if (!result)
            {
                return BadRequest(new ErrorResponse() { ErrorMessage = $"Failed to update Purchase Order with ID {id}." });
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePurchaseOrder(int id)
        {
            var result = await _orderService.DeletePurchaseOrderAsync(id);

            if (!result)
            {
                return NotFound(new ErrorResponse()
                {
                    ErrorMessage = $"Failed to delete Purchase Order with ID {id}."
                });
            }

            return Ok(result);
        }
    }
}
