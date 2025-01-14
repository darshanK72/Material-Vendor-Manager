using material_vender_api.Handlers;

namespace material_vender_api.Extentions
{
    public static class ExceptionHandlingExtension
    {
        public static IServiceCollection AddGlobalExceptionHandler(this IServiceCollection services)
        {
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.AddProblemDetails();

            return services;
        }
    }
}
