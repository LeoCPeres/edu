export function whichRoute(route: string) {
  if (route.includes("profile")) return "Perfil";
  if (route.includes("teachers/edit")) return "Editar perfil";

  return {
    "/teacher/register": "Dar aulas",
    "/teacher/classes": "Dar aulas",
    "/teachers": "Estudar",
  }[route] as string;
}
