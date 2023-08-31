export const whichRoute = (route: string) =>
  ({
    "/teacher/register": "Dar aulas",
    "/teachers": "Estudar",
  }[route] as string);
