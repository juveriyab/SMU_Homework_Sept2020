from sqlalchemy import create_engine
import pandas as pd
import numpy as np

class SQLHelper():

    def __init__(self):
        self.connection_string = f"sqlite:///data//hawaii.sqlite"
        self.engine = create_engine(self.connection_string)

    def get_test(self):
        query = """
                Select 
                    *
                from
                    measurement
                limit 100
                """

        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_precipitation(self):
        query = """
                Select 
                    station,
                    date,
                    prcp
                from
                    measurement
                where  
                    date >=(
                                SELECT
                                date(MAX(date), '-365 day')
                                FROM
                                    measurement
                            )
                order by
                    date, station
                """

        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_all_stations(self):
        query = """
                SELECT
                    s.station,
                    s.name, 
                    s.latitude, 
                    s.longitude, 
                    s.elevation,
                    count(*) as tot_obs
                FROM
                    station s
                    JOIN measurement m on s.station = m.station
                GROUP BY
                    s.station, s.name, s.latitude, s.longitude, s.elevation
                ORDER BY
                    count(*) desc
                """

        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_most_active_tobs(self):
        query = """
                SELECT
                    date,
                    station,
                    tobs
                FROM
                    measurement
                WHERE
                    date >= (
                                SELECT
                                    date(MAX(date), '-365 day')
                                FROM
                                    measurement
                            )
                                AND
                                    station = (
                                SELECT
                                    s.station
                                FROM
                                    station s
                                JOIN measurement m on s.station = m.station
                                GROUP BY s.station
                                ORDER BY
                                    count(*) desc
                                LIMIT 1
                            )
                ORDER BY
                    date, station

                """

        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_temp_date_range(self, start_date, end_date):
        query = f"""
                SELECT
                    min(tobs) as min_tobs,
                    max(tobs) as max_tobs,
                    avg(tobs) as avg_tobs
                FROM
                    measurement
                WHERE
                    date >= '{start_date}'
                    AND date <= '{end_date}'
                """ 
        
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_temp_data_for_date(self, start_date):
        query = f"""
                SELECT
                    min(tobs) as min_tobs,
                    max(tobs) as max_tobs,
                    avg(tobs) as avg_tobs
                FROM
                    measurement
                WHERE
                    date = '{start_date}'
                """ 
        
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

