const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Job {
  static async getAll() {
    return await prisma.job.findMany({
      include: { company: true, user: true },
      orderBy: { postedAt: "desc" },
    });
  }

  static async create(data) {
    return await prisma.job.create({ data });
  }

  static async getById(id) {
    return await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { company: true, user: true },
    });
  }

  static async update(id, data) {
    return await prisma.job.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  static async delete(id) {
    return await prisma.job.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = Job;
