import { ScheduleType } from "../types/Schedule.interface";

export function generateSchedule(teacherSechedule: ScheduleType[]) {
  // Função para criar um objeto de programação com as propriedades fornecidas
  function createScheduleObject({
    id,
    week_day,
    from,
    to,
    isDisabled = false,
  }: ScheduleType) {
    return { id, week_day, from, to, isDisabled };
  }

  // Função para criar uma lista de objetos de programação para a semana
  function createWeeklySchedule(scheduleData: ScheduleType[]) {
    const daysOfWeek = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const weeklySchedule = [];

    for (let i = 0; i < 7; i++) {
      const dayName = daysOfWeek[i];
      const scheduleInfo = scheduleData?.find(
        (item) => parseInt(item.week_day) === i
      );

      if (scheduleInfo) {
        weeklySchedule?.push(
          createScheduleObject({
            id: scheduleInfo.id,
            week_day: dayName,
            from: scheduleInfo.from,
            to: scheduleInfo.to,
          })
        );
      } else {
        weeklySchedule?.push(
          createScheduleObject({
            id: "",
            week_day: dayName,
            from: "",
            to: "",
            isDisabled: true,
          })
        );
      }
    }

    return weeklySchedule;
  }

  return createWeeklySchedule(teacherSechedule);
}
