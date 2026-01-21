export interface TimeSlot {
  value: string;
  label: string;
}

export class TimeValidators {
  static generateTimeSlots(): TimeSlot[] {
    const times: TimeSlot[] = [];
    const now = new Date();
    const minTime = new Date(now.getTime() + 20 * 60 * 1000);
    const isMonday = now.getDay() === 1;
    const openingHour = isMonday ? 16 : 12;

    let minutes = Math.ceil(minTime.getMinutes() / 5) * 5;
    let hours = minTime.getHours();

    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }

    const startMinutes = hours * 60 + minutes;
    const endMinutes = 22 * 60 + 30;

    for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += 5) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;

      if (h < openingHour || h > 22 || (h === 22 && m > 30)) continue;

      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      times.push({
        value: timeStr,
        label: `${timeStr} Uhr`
      });
    }

    return times;
  }

  static isValidTimeSlot(time: string): boolean {
    const slots = this.generateTimeSlots();
    return slots.some(slot => slot.value === time);
  }

  static getMinAdvanceMinutes(): number {
    return 20;
  }

  static getOpeningHours(isMonday: boolean): { start: number; end: number } {
    return {
      start: isMonday ? 16 : 12,
      end: 22
    };
  }
}
