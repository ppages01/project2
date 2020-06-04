import pandas as pd
import numpy as np
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
from flask import Flask, jsonify, render_template
import json
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify
import datetime as dt

########## WERKZEUG & JUPYTER ##################
#from werkzeug.wrappers import request, response 



#################################################

db_user = os.environ.get("DB_USER")
db_pass = os.environ.get("DB_PASS")
db_name = os.environ.get("DB_NAME")
cloud_sql_instance_name = os.environ.get("CLOUD_SQL_INSTANCE_NAME")

app = Flask(__name__, static_folder='static')


#engine = create_engine('postgresql://postgres:Password123@127.0.0.1:5432/project2')

engine = create_engine('postgres://mciflyxdcdqcho:b21b8490e526450b51426d2a26de314af06eba94975a885b678a3d0c70c0445f@ec2-50-17-21-170.compute-1.amazonaws.com:5432/d5g4rqlktctgjs')

#engine =create_engine(f'postgres+pg8000://{db_user}:{db_pass}@/{db_name}?unix_sock=/cloudsql/{cloud_sql_instance_name}/.s.PGSQL.5432')
connection = engine.connect()


Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Base.classes.keys()

# Save references to each table
salesx = Base.classes.sales

def _rangefinder(last_date):
    
    #formated_date = dt.datetime.strptime(last_date, "%Y-%m-%d")
        
    Year = int(dt.datetime.strftime(last_date, '%Y'))
    Month = int(dt.datetime.strftime(last_date, '%m'))
    Day = int(dt.datetime.strftime(last_date, '%d'))
    
    start_date = dt.date(Year, Month, Day) - dt.timedelta(days=365)
    return(start_date)
    

@app.route('/')
def index():
    
    return render_template('index.html')

@app.route('/sales')

def sales():
    """Return Sales Data."""
    return render_template('sales.html')

@app.route('/chart')
def chart():
    """Return chart Data."""
    return render_template('chart.html')

@app.route('/map')
def map():
    """Return chart Data."""
    return render_template('map.html')

##Use to Fill the Drop Down
@app.route('/api/getyear')

def get_year():    
    
    session = Session(engine)
    result = engine.execute("select distinct(year) from sales")
    session.close()
    results = []
    return jsonify({'result': [dict(row) for row in result]})
    


## Table Testing
@app.route('/api/sales/2020/table')

def table_summary():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty) as unitsold, sales.country, avg(sales.price) as avgunitprice, sales.product from sales where date between  '01-01-2020' and '12-31-2020' group by sales.country, sales.price,sales.product order by unitsold desc")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2019/table')

def table_summary1():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty) as unitsold, sales.country, avg(sales.price) as avgunitprice, sales.product from sales where date between  '01-01-2019' and '12-31-2019' group by sales.country, sales.price,sales.product order by unitsold desc")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2018/table')

def table_summary2():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty) as unitsold, sales.country, avg(sales.price) as avgunitprice, sales.product from sales where date between  '01-01-2018' and '12-31-2018' group by sales.country, sales.price,sales.product order by unitsold desc")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  
    
    
## TESTING NEW ROUTE FOR STACKED ##

@app.route('/api/sales/2020/productc')

def c_sales1():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2020' and '12-31-2020' and sales.product ='C' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  



@app.route('/api/sales/2020/productb')

def b_sales1():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2020' and '12-31-2020' and sales.product ='B' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2020/producta')

def a_sales1():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2020' and '12-31-2020' and sales.product ='A' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  


@app.route('/api/sales/2019/productc')

def c_sales2():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2019' and '12-31-2019' and sales.product ='C' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  



@app.route('/api/sales/2019/productb')

def b_sales2():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2019' and '12-31-2019' and sales.product ='B' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2019/producta')

def a_sales2():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2019' and '12-31-2019' and sales.product ='A' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2018/productc')

def c_sales3():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2018' and '12-31-2018' and sales.product ='C' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  



@app.route('/api/sales/2018/productb')

def b_sales3():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2018' and '12-31-2018' and sales.product ='B' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  

@app.route('/api/sales/2018/producta')

def a_sales3():    
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.month from sales where date between  '01-01-2018' and '12-31-2018' and sales.product ='A' group by sales.month order by month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})  




###################END SECTION#######################

##Routes for Sales Mapping Yearly
@app.route('/api/sales/2020/map')


def mapsales1():
    session = Session(engine)    
    result = engine.execute("select city, lat, lng, sum(revenue), avg(price) from sales where date between  '01-01-2020' and '12-31-2020' group by city, lat, lng order by city")
    #result = engine.execute("select revenue, lat, lng, city from sales where date between  '01-01-2020' and '12-31-2020'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2019/map')

def mapsales2():
    session = Session(engine)    
    result = engine.execute("select city, lat, lng, sum(revenue), avg(price) from sales where date between  '01-01-2019' and '12-31-2019' group by city, lat, lng order by city")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2018/map')

def mapsales3():
    session = Session(engine)    
    result = engine.execute("select city, lat, lng, sum(revenue), avg(price) from sales where date between  '01-01-2018' and '12-31-2018' group by city, lat, lng order by city")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})


## SALES BY PRODUCT TYPE
@app.route('/api/sales/2020/byptype')

def prod_type1():
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.product_type from sales where date between  '01-01-2020' and '12-31-2020' group by sales.product_type")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2019/byptype')

def prod_type2():
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.product_type from sales where date between  '01-01-2019' and '12-31-2019' group by sales.product_type")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2018/byptype')

def prod_type3():
    session = Session(engine)
    result = engine.execute("select sum(sales.qty), sales.product_type from sales where date between  '01-01-2018' and '12-31-2018' group by sales.product_type")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})


##Sales by Products Sum(entire year/all territories)
@app.route('/api/sales/2020/byproducts')

def prod_count1():
    session = Session(engine)
    result = engine.execute("select product, sum(qty) from sales where date between  '01-01-2020' and '12-31-2020' group by sales.product ")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2019/byproducts')

def prod_count2():
    session = Session(engine)
    result = engine.execute("select product, sum(qty) from sales where date between  '01-01-2019' and '12-31-2019' group by sales.product ")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route('/api/sales/2018/byproducts')

def prod_count3():
    session = Session(engine)
    result = engine.execute("select product, sum(qty) from sales where date between  '01-01-2018' and '12-31-2018' group by sales.product ")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

# YEARLY SALES #   
@app.route("/api/sales/2020")
def sales_year1():
    session = Session(engine)
    result = engine.execute("select sum(revenue), sales.month from sales where date between  '01-01-2020' and '12-31-2020' group by sales.month order by sales.month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019")
def sales_year2():
    session = Session(engine)
    result = engine.execute("select sum(revenue), sales.month from sales where date between  '01-01-2019' and '12-31-2019' group by sales.month order by sales.month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018")
def sales_year3():
    session = Session(engine)
    result = engine.execute("select sum(revenue), sales.month from sales where date between  '01-01-2018' and '12-31-2018' group by sales.month order by sales.month")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})


##Top COUNTRY
@app.route("/api/sales/2020/topcountries")
def get_top_c():
    session = Session(engine)
    result = engine.execute("select country as country, sum(revenue) as revenue from sales where date between  '01-01-2020' and '12-31-2020' group by country order by revenue DESC").fetchall()
    session.close()
    
    topresults = [] 
    for country, revenue in result:
        data= {}
        data['Country']=country
        data['Revenue']=str(round(revenue,2))
        topresults.append(data)
    return jsonify(topresults)
    # return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/topcountries")
def get_top_c1():
    session = Session(engine)
    result = engine.execute("select sales.country, sum(revenue) as revenue from sales where date between  '01-01-2019' and '12-31-2019' group by sales.country order by revenue DESC")
    session.close()

    topresults = [] 
    for country, revenue in result:
        data= {}
        data['Country']=country
        data['Revenue']=str(round(revenue,2))
        topresults.append(data)
    return jsonify(topresults)
    # return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018/topcountries")
def get_top_c2():
    session = Session(engine)
    result = engine.execute("select sales.country, sum(revenue) as revenue from sales where date between  '01-01-2018' and '12-31-2018' group by sales.country order by revenue DESC")
    session.close()

    topresults = [] 
    for country, revenue in result:
        data= {}
        data['Country']=country
        data['Revenue']=str(round(revenue,2))
        topresults.append(data)
    return jsonify(topresults)
    # return jsonify({'result': [dict(row) for row in result]})
## Top Cities
@app.route("/api/sales/2020/topcities")
def get_top_cy():
    session = Session(engine)
    result = engine.execute("select sales.city, sum(revenue) as revenue from sales where date between  '01-01-2020' and '12-31-2020' group by sales.city, sales.product order by revenue DESC")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/topcities")
def get_top_cy1():
    session = Session(engine)
    result = engine.execute("select sales.city, sum(revenue) as revenue from sales where date between  '01-01-2019' and '12-31-2019' group by sales.city, sales.product order by revenue DESC")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})
    
@app.route("/api/sales/2018/topcities")
def get_top_cy2():
    session = Session(engine)
    result = engine.execute("select sales.city, sum(revenue) as revenue from sales where date between  '01-01-2018' and '12-31-2018' group by sales.city, sales.product order by revenue DESC")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

## HEADLINE SUM
@app.route("/api/sales/2020/revenue")
def rev_total():
    session = Session(engine)
    result = engine.execute("select sum(revenue) as revenue from sales where date between  '01-01-2020' and '12-31-2020'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/revenue")
def rev_total2():
    session = Session(engine)
    result = engine.execute("select sum(revenue) as revenue from sales where date between  '01-01-2019' and '12-31-2019'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018/revenue")
def rev_total3():
    session = Session(engine)
    result = engine.execute("select sum(revenue) as revenue from sales where date between  '01-01-2018' and '12-31-2018'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

#HEADLINE AVERAGE
@app.route("/api/sales/2020/avg_revenue")
def arev_total():
    session = Session(engine)
    result = engine.execute("select sum(revenue)/12 as revenue from sales where date between  '01-01-2020' and '12-31-2020'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/avg_revenue")
def arev_total1():
    session = Session(engine)
    result = engine.execute("select sum(revenue)/12 as revenue from sales where date between  '01-01-2019' and '12-31-2019'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018/avg_revenue")
def arev_total2():
    session = Session(engine)
    result = engine.execute("select sum(revenue)/12 as revenue from sales where date between  '01-01-2018' and '12-31-2018'")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

#BEST SELLING PRODUCT
@app.route("/api/sales/2020/bestproduct")
def best_seller():
    session = Session(engine)
    result = engine.execute("select product,sum(qty) from sales where date between '01-01-2020' and '12-31-2020' group by product order by sum desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/bestproduct")
def best_seller2():
    session = Session(engine)
    result = engine.execute("select product,sum(qty) from sales where date between '01-01-2019' and '12-31-2019' group by product order by sum desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018/bestproduct")
def best_seller3():
    session = Session(engine)
    result = engine.execute("select product,sum(qty) from sales where date between '01-01-2018' and '12-31-2018' group by product order by sum desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2020/bestcountry")
def best_country1():
    session = Session(engine)
    result = engine.execute("select country, sum(revenue) as revenue from sales where date between  '01-01-2020' and '12-31-2020' group by sales.country order by revenue desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2019/bestcountry")
def best_country2():
    session = Session(engine)
    result = engine.execute("select country, sum(revenue) as revenue from sales where date between  '01-01-2019' and '12-31-2019' group by sales.country order by revenue desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/sales/2018/bestcountry")
def best_country3():
    session = Session(engine)
    result = engine.execute("select country, sum(revenue) as revenue from sales where date between  '01-01-2018' and '12-31-2018' group by sales.country order by revenue desc fetch first 1 rows only")
    session.close()
    return jsonify({'result': [dict(row) for row in result]})






if __name__ == "__main__":
    app.run(debug=True)
# use this to run from INSIDE jupyter notebook
# if __name__ == "__main__":
#     from werkzeug.serving import run_simple
#     run_simple('localhost',9000,app)
#     app.run(debug=True)
