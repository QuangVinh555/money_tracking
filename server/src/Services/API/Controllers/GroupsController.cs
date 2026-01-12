using Application.Features.DTOs.Groups;
using Application.Features.DTOs.PagedResult;
using Application.Features.DTOs.Transactions;
using Application.Features.Groups.Commands;
using Application.Features.Groups.Queries;
using Core.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GroupsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IGroupQuery _groupQuery;
        private readonly IGroupTransactionQuery _groupTransactionQuery;
        private readonly IUserSearchQuery _userSearchQuery;

        public GroupsController(IMediator mediator, IGroupQuery groupQuery, IGroupTransactionQuery groupTransactionQuery, IUserSearchQuery userSearchQuery)
        {
            _mediator = mediator;
            _groupQuery = groupQuery;
            _groupTransactionQuery = groupTransactionQuery;
            _userSearchQuery = userSearchQuery;
        }

        /// <summary>
        /// Lấy danh sách tất cả nhóm mà user là thành viên
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetGroups()
        {
            var data = await _groupQuery.GetGroupsAsync();

            return Ok(new ApiResponse<List<GroupResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy danh sách nhóm thành công."
            });
        }

        /// <summary>
        /// Lấy chi tiết nhóm
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroupDetail(int id)
        {
            var data = await _groupQuery.GetGroupDetailAsync(id);

            if (data == null)
            {
                return NotFound(new ApiResponse<GroupDetailResponse>
                {
                    Success = false,
                    Message = "Nhóm không tồn tại hoặc bạn không có quyền truy cập."
                });
            }

            return Ok(new ApiResponse<GroupDetailResponse>
            {
                Success = true,
                Data = data,
                Message = "Lấy chi tiết nhóm thành công."
            });
        }

        /// <summary>
        /// Tạo nhóm mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupCommand request)
        {
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response);

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response);

            return StatusCode(500, response);
        }

        /// <summary>
        /// Cập nhật thông tin nhóm
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(int id, [FromBody] UpdateGroupCommand request)
        {
            request.GroupId = id;
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response);

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response);

            return StatusCode(500, response);
        }

        /// <summary>
        /// Thêm thành viên vào nhóm
        /// </summary>
        [HttpPost("{id}/members")]
        public async Task<IActionResult> AddMember(int id, [FromBody] AddGroupMemberCommand request)
        {
            request.GroupId = id;
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response);

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response);

            return StatusCode(500, response);
        }

        /// <summary>
        /// Xóa thành viên khỏi nhóm
        /// </summary>
        [HttpDelete("{id}/members/{userId}")]
        public async Task<IActionResult> RemoveMember(int id, int userId)
        {
            var request = new RemoveGroupMemberCommand
            {
                GroupId = id,
                UserIdToRemove = userId
            };

            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response);

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response);

            return StatusCode(500, response);
        }

        /// <summary>
        /// Lấy dashboard của nhóm (tổng thu, tổng chi, số dư)
        /// </summary>
        [HttpGet("{id}/dashboard")]
        public async Task<IActionResult> GetGroupDashboard(int id, [FromQuery] DateOnly? optionDate)
        {
            var data = await _groupTransactionQuery.GetGroupDashboardAsync(id, optionDate);

            if (data == null)
            {
                return NotFound(new ApiResponse<TransactionsTotalCardResponse>
                {
                    Success = false,
                    Message = "Nhóm không tồn tại hoặc bạn không có quyền truy cập."
                });
            }

            return Ok(new ApiResponse<TransactionsTotalCardResponse>
            {
                Success = true,
                Data = data,
                Message = "Lấy dashboard nhóm thành công."
            });
        }

        /// <summary>
        /// Lấy danh sách giao dịch của nhóm
        /// </summary>
        [HttpGet("{id}/transactions")]
        public async Task<IActionResult> GetGroupTransactions(int id, [FromQuery] DateOnly? optionDate, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var data = await _groupTransactionQuery.GetGroupTransactionsAsync(id, optionDate, pageNumber, pageSize);

            if (data == null)
            {
                return NotFound(new ApiResponse<PagedResult<TransactionsResponse>>
                {
                    Success = false,
                    Message = "Nhóm không tồn tại hoặc bạn không có quyền truy cập."
                });
            }

            return Ok(new ApiResponse<PagedResult<TransactionsResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy giao dịch nhóm thành công."
            });
        }

        /// <summary>
        /// Lấy giao dịch nhóm theo ngày
        /// </summary>
        [HttpGet("{id}/transactions/group-by-date")]
        public async Task<IActionResult> GetGroupTransactionsGroupByDate(int id, [FromQuery] DateOnly? optionDate)
        {
            var data = await _groupTransactionQuery.GetGroupTransactionsGroupByDateAsync(id, optionDate);

            if (data == null)
            {
                return NotFound(new ApiResponse<List<TransactionsGroupByDateResponse>>
                {
                    Success = false,
                    Message = "Nhóm không tồn tại hoặc bạn không có quyền truy cập."
                });
            }

            return Ok(new ApiResponse<List<TransactionsGroupByDateResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy giao dịch nhóm thành công."
            });
        }

        /// <summary>
        /// Xóa nhóm
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var request = new DeleteGroupCommand { GroupId = id };
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response);

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response);

            return StatusCode(500, response);
        }

        /// <summary>
        /// Tìm kiếm user theo email
        /// </summary>
        [HttpGet("search-users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string email)
        {
            var data = await _userSearchQuery.SearchUsersByEmailAsync(email);

            return Ok(new ApiResponse<List<UserSearchResponse>>
            {
                Success = true,
                Data = data,
                Message = "Tìm kiếm user thành công."
            });
        }
    }
}
