export const getReadableSubject = (value: string): string => {
  const subjects: Record<string, string> = {
    portugues: "Língua Portuguesa",
    matematica: "Matemática",
    historia: "História",
    geografia: "Geografia",
    ciencias: "Ciências",
    fisica: "Física",
    quimica: "Química",
    biologia: "Biologia",
    ingles: "Língua Inglesa",
    artes: "Artes",
    educacaofisica: "Educação Física",
    filosofia: "Filosofia",
    sociologia: "Sociologia",
  };

  return subjects[value] || "Matéria Desconhecida";
};
