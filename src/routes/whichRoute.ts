export function whichRoute(route: string) {
  if (route.includes("profile")) return "Perfil";

  return {
    "/teacher/register": "Dar aulas",
    "/teachers": "Estudar",
  }[route] as string;
}
