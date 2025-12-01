using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.PagedResult
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }      // tổng số bản ghi
        public int PageNumber { get; set; }      // trang hiện tại
        public int PageSize { get; set; }        // số bản ghi/trang
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

}
