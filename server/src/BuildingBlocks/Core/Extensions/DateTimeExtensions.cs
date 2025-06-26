using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Extensions
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Ngày đầu tiên của tháng(UTC)
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static DateTime ToUtcStartOfMonth(this DateTime date)
            => new(date.Year, date.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        /// <summary>
        /// Ngày cuối cùng của tháng(UTC)
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static DateTime ToUtcEndOfMonth(this DateTime date)
            => new(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59, DateTimeKind.Utc);

        /// <summary>
        /// Ép kiểu datetime về dạng UTC
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static DateTime EnsureUtc(DateTime dt)
        {
            return dt.Kind == DateTimeKind.Utc
                ? dt
                : TimeZoneInfo.ConvertTimeToUtc(dt);
        }

    }

}
