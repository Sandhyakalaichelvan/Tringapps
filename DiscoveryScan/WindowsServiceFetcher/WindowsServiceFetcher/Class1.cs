using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;


namespace WindowsServiceFetcher
{
    public class ServiceInfo
    {
      
        public string Name { get; set; }
        public ServiceControllerStatus Status { get; set; }
    }

    public class ServiceFetcher
    {
        public static List<ServiceInfo> GetDuckCreekServices(string remoteServer, string username, string password)
        {
            List<ServiceInfo> duckCreekServices = new List<ServiceInfo>();

            ServiceController[] serviceControllers = ServiceController.GetServices();
            foreach (ServiceController serviceController in serviceControllers)
            {
                if (serviceController.ServiceName.StartsWith("Device", StringComparison.OrdinalIgnoreCase))
                {
                    ServiceInfo serviceInfo = new ServiceInfo
                    {
                       
                        Name = serviceController.ServiceName,
                        Status = serviceController.Status
                    };

                    duckCreekServices.Add(serviceInfo);
                }
            }

            return duckCreekServices;
        }
    }

}
