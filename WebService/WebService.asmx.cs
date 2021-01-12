using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace CompanyZ.WebService
{
    /// <summary>
    /// Summary description for WebService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]

    public class WebService : System.Web.Services.WebService
    {
        string connString = System.Configuration.ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

        [WebMethod]
        public void GetCustomerList()
        {
            string sql = @"
                SELECT
	                c.id,
                    c.name,
                    CASE 
		                WHEN year(c.dob) <= 1900 THEN NULL 
		                ELSE CONVERT(CHAR(10), c.dob, 126)
	                END AS dob,
	                c.address,
	                g.gender,
	                c.contact,
	                s.source
                FROM
                    customers c LEFT JOIN
	                genders g ON c.gender = g.id LEFT JOIN
	                sources s ON c.source = s.id
                WHERE
                    c.deleted = 0";

            DataTable dt = Common.ExecuteQueryInDT(connString, sql);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }

        [WebMethod]
        public void AddCustomer(string name, string dob, string address, int gender, string contact, int source)
        {
            string sql = @"
                INSERT INTO customers (name, dob, address, gender, contact, source, updateDate) 
                OUTPUT Inserted.id                
                VALUES (@name, @dob, @address, @gender, @contact, @source, GETDATE())";

            List<SqlParameter> sqlParams = new List<SqlParameter>
            {
                new SqlParameter("@name", name),
                new SqlParameter("@dob", dob),
                new SqlParameter("@address", address),
                new SqlParameter("@gender", gender),
                new SqlParameter("@contact", contact),
                new SqlParameter("@source", source),
            };

            DataTable dt = Common.ExecuteQueryInDT(connString, sql, sqlParams);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }

        [WebMethod]
        public void EditCustomer(string id, string name, string dob, string address, int gender, string contact, int source)
        {
            string sql = @"
                UPDATE
                    c
                SET
                    c.name = @name,
                    c.dob = @dob,
                    c.address = @address,
                    c.gender = @gender,
                    c.contact = @contact,
                    c.source = @source
                FROM
                    customers c
                WHERE
                    c.id = @id";

            List<SqlParameter> sqlParams = new List<SqlParameter>
            {
                new SqlParameter("@id", id),
                new SqlParameter("@name", name),
                new SqlParameter("@dob", dob),
                new SqlParameter("@address", address),
                new SqlParameter("@gender", gender),
                new SqlParameter("@contact", contact),
                new SqlParameter("@source", source),
            };

            DataTable dt = Common.ExecuteQueryInDT(connString, sql, sqlParams);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }

        [WebMethod]
        public void DeleteCustomer(int id)
        {
            string sql = @"
                UPDATE
                    c
                SET
                    c.deleted = 1
                FROM
                    customers c
                WHERE
                    c.id = @id";

            List<SqlParameter> sqlParams = new List<SqlParameter>
            {
                new SqlParameter("@id", id),
            };

            DataTable dt = Common.ExecuteQueryInDT(connString, sql, sqlParams);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }

        [WebMethod]
        public void GetGender()
        {
            string sql = @"
                SELECT
                    id,
                    RTRIM(gender) AS gender
                FROM
                    genders";

            DataTable dt = Common.ExecuteQueryInDT(connString, sql);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }

        [WebMethod]
        public void GetSource()
        {
            string sql = @"
                SELECT
                    id,
                    RTRIM(source) AS source
                FROM
                    sources";

            DataTable dt = Common.ExecuteQueryInDT(connString, sql);

            Context.Response.Write(JsonConvert.SerializeObject(dt));
        }
    }
}
