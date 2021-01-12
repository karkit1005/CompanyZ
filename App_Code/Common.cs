using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

public class Common
{
    public static DataSet ExecuteQueryInDS(string connString, string strsql, List<SqlParameter> sqlParam)
    {
        DataSet ds = new DataSet();
        using (SqlConnection connection = new SqlConnection(connString))
        {
            try
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(strsql, connection))
                {
                    if (sqlParam != null)
                        command.Parameters.AddRange(sqlParam.ToArray());
                    using (SqlDataAdapter sda = new SqlDataAdapter(command))
                    {
                        sda.Fill(ds);
                        command.Parameters.Clear();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        return ds;
    }
    public static DataTable ExecuteQueryInDT(string connString, string strsql)
    {
        return ExecuteQueryInDT(connString, strsql, null);
    }

    public static DataTable ExecuteQueryInDT(string connString, string strsql, List<SqlParameter> sqlParam)
    {

        DataSet ds = ExecuteQueryInDS(connString, strsql, sqlParam);
        DataTable dt = new DataTable();

        if (ds.Tables.Count > 0)
            dt = ds.Tables[0];

        return dt;
    }

    public static string ExecuteQueryInString(string connString, string strsql)
    {
        return ExecuteQueryInString(connString, strsql, null);
    }

    public static string ExecuteQueryInString(string connString, string strsql, List<SqlParameter> sqlParam)
    {
        string id = null;

        DataTable dt = ExecuteQueryInDT(connString, strsql, sqlParam);

        if (dt.Rows.Count > 0)
            id = dt.Rows[0][0].ToString();

        return id;
    }
}