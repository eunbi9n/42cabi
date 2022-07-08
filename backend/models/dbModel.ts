import mariadb from "mariadb";
import { cabinetInfo, cabinetListInfo } from "./types";

const con = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "42cabi_test",
  dateStrings: true,
});

export async function connectionForCabinet() : Promise<cabinetListInfo> {
  // if (cabinetList.location?.length) return;
  const cabinet : cabinetListInfo = {
    location : [],
    floor : [],
    section : [],
    cabinet : [],
  };
  let pool: mariadb.PoolConnection;
  try {
    pool = await con.getConnection();
    //location info
    const content1: string = "select distinct cabinet.location from cabinet";
    const result1 = await pool.query(content1);
    result1.forEach(async (element1: any) => {
      let floorList: Array<number> = [];
      let list: Array<Array<string>> = [];
      let tmpCabinetList: Array<Array<Array<cabinetInfo>>> = [];
      const content2: string = `select distinct cabinet.floor from cabinet where location='${element1.location}' order by floor`;

      cabinet.location?.push(element1.location);
      //floor info with exact location
      const result2 = await pool.query(content2);
      result2.forEach(async (element2: any) => {
        let sectionList: Array<string> = [];
        let cabinet: Array<Array<cabinetInfo>> = [];
        const content3: string = `select distinct cabinet.section from cabinet where location='${element1.location}' and floor=${element2.floor}`;

        floorList.push(element2.floor);
        //section info with exact floor
        const result3 = await pool.query(content3);
        result3.forEach(async (element3: any) => {
          let lastList: Array<cabinetInfo> = [];
          const content4: string = `select * from cabinet where location='${element1.location}' and floor=${element2.floor} and section='${element3.section}' and activation=1 order by cabinet_num`;

          sectionList.push(element3.section);
          //cabinet info with exact section
          const result4 = await pool.query(content4);
          result4.forEach(async (element4: any) => {
            lastList.push(element4);
          });
          cabinet.push(lastList);
        });
        list.push(sectionList);
        tmpCabinetList.push(cabinet);
      });
      cabinet.floor?.push(floorList);
      cabinet.section?.push(list);
      cabinet.cabinet?.push(tmpCabinetList);
    });
    if (pool) pool.end();
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    return cabinet;
  }
}
