
# A very simple Flask Hello World app for you to get started with...

from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager,create_access_token,jwt_required
import pymysql


app = Flask(__name__)

CORS(app)


SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@127.0.0.1:3307/ai_engine"
   

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
JWTManager(app)
db = SQLAlchemy(app)
app.secret_key='hey'



class SuuperAdmin(db.Model):
    __tablename__ = 'superAdmin'
    registerID = db.Column(db.Integer,primary_key = True, autoincrement = True)
    userName = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    status = db.Column(db.String)

# @app.route('/createUser',methods=['POST'])
# def createUser():
#     datas =  request.form
#     registerData = SuuperAdmin(userName = datas['userName'],email = datas['email'],password = datas['password'],status = datas['status'])
#     db.session.add(registerData)
#     db.session.commit()
#     # return 'register successfully'
#     return jsonify({
#         'RegisterId': registerData.registerID,
#         'Name': registerData.userName,
#         'email': registerData.email,
#         'password': registerData.password,
#         'status': registerData.status
#     })
#     # registerDatas = SuuperAdmin.query.all()
#     # return jsonify([
#     #     {
#     #         'RegisterId': data.registerID,
#     #         'Name': data.userName,
#     #         'email': data.email,
#     #         'password': data.password,
#     #         'status': data.status
#     #     } for data in registerDatas
#     # ])

# Register
@app.route('/createUser', methods=['POST'])
def createUser():
    datas = request.form  # Use request.get_json() if you're sending JSON

    registerData = SuuperAdmin(
        userName=datas['userName'],
        email=datas['email'],
        password=datas['password'],
        status=datas['status']
    )
    db.session.add(registerData)
    db.session.commit()

    # Send only the created user's info
    return jsonify({
        'registerID': registerData.registerID,
        'userName': registerData.userName,
        'email': registerData.email,
        'status': registerData.status
    })

# superAdmin
@app.route('/getRegisterData',methods=['GET'])
def getRegisterData():
    registerDatas = SuuperAdmin.query.all()
    return jsonify(
        [
            {
                'RegisterId' : data.registerID,
                'Name':data.userName,
                'email':data.email,
                'password':data.password,
                'status':data.status
            }for data in registerDatas
        ])


# superAdmin Change status
@app.route('/changeStatus/<int:changeId>', methods=['PUT'])
def changeStatus(changeId):
    change = SuuperAdmin.query.filter_by(registerID=changeId).first()

    if not change:
        return jsonify({'error': 'User not found'}), 404

    data = request.form  # ✅ Matches FormData
    change.status = data['status']
    db.session.commit()

    return jsonify({
        'registerID': change.registerID,
        'userName': change.userName,
        'email': change.email,
        'password': change.password,
        'status': change.status
    })


# Login
# @app.route('/log',methods=['POST'])
# def loginUser():
#     data = request.form
#     loginData = SuuperAdmin.query.filter_by(email=data['emaildata'],password=data['passworddata']).first()
#     tokendata = create_access_token(identity = data['emaildata'])

#     if loginData is None:
#         return "user is not found"


#     return jsonify({'email':loginData.email,'userName':loginData.password,'token':tokendata,"status":loginData.status})

@app.route('/log', methods=['POST'])
def loginUser():
    data = request.form
    loginData = SuuperAdmin.query.filter_by(email=data['emaildata'], password=data['passworddata']).first()

    if loginData is None:
        return jsonify({'error': 'User not found'}), 401

    tokendata = create_access_token(identity=loginData.email)

    return jsonify({
        'registerID': loginData.registerID,      
        'email': loginData.email,
        'userName': loginData.userName,
        'status': loginData.status,
        'token': tokendata
    })




# -----FOR CATETORY------
class SetCategory(db.Model):
    __tablename__ = 'category'
    categoryId = db.Column(db.Integer,primary_key = True,autoincrement = True)
    categoryName = db.Column(db.String)
    registerID = db.Column(db.Integer,db.ForeignKey('superAdmin.registerID'))

# POST CATEGORY
# @app.route("/categoryList",methods=["GET","POST"])
# @jwt_required()
# def category():
#     if request.method== "POST":
#         categorydata=SetCategory(categoryName=request.form["categoryName"])
#         db.session.add(categorydata)
#         db.session.commit()
#     # return "success"
#     return jsonify({
#         "categoryId":categorydata.categoryId,
#         "categoryName":categorydata.categoryName,
#         "registerID":categorydata.registerID,
#         "msg":"success"
#     })


# POST CATEGORY
@app.route("/categoryList", methods=["POST"])
@jwt_required()
def category():
    try:
        categorydata = SetCategory(
            categoryName=request.form["categoryName"],
            registerID=request.form["registerID"]
        )
        db.session.add(categorydata)
        db.session.commit()

        return jsonify({
            "categoryId": categorydata.categoryId,
            "categoryName": categorydata.categoryName,
            "registerID": categorydata.registerID,
            "msg": "success"
        })

    except Exception as e:
        return jsonify({"msg": "Failed", "error": str(e)}), 500

# # GET CATEGORY
# @app.route('/getCategory',methods = ["GET"])
# @jwt_required()
# def getCategory():
#     getCategories = SetCategory.query.all()
#     return jsonify([
#                         {'categoryId':category.categoryId,'categoryName':category.categoryName} for category in getCategories
#                     ])


# GET particular CATEGORY
@app.route('/getCategory/<int:id>',methods = ["GET"])
@jwt_required()
def getCategory(id):
    getCategories = SetCategory.query.filter_by(registerID=id).all()
    return jsonify([
                        {'categoryId':category.categoryId,'categoryName':category.categoryName,'registerID':category.registerID} for category in getCategories
                    ])


# -----FOR TYPE-----
class SetType(db.Model):
    __tablename__ = 'type'
    typeId = db.Column(db.Integer,primary_key = True,autoincrement = True)
    typeName = db.Column(db.String)
    categoryId = db.Column(db.Integer,db.ForeignKey('category.categoryId'))

# GET PARTICULAR TYPE
@app.route("/settingGetType/<int:id>", methods=["GET"])
@jwt_required()
def getTypes(id):
    type_list=SetType.query.filter_by(categoryId=id).all()
    return jsonify([
        {"typeId":lists.typeId,"typeName":lists.typeName,"categoryId":lists.categoryId}for lists in type_list
        ])


# POST TYPE
@app.route("/typeList",methods=["GET","POST"])
@jwt_required()
def addtype():
    if request.method== "POST":
        typedata=SetType(typeName=request.form["typeName"],
                                 categoryId=request.form["categoryId"]  )
        db.session.add(typedata)
        db.session.commit()
    # return "success"
    return jsonify({
        "categoryId":typedata.categoryId,
        "typeName":typedata.typeName,
         "typeId":typedata.typeId
    })



# # GET TYPE
# @app.route('/getType/<int:category_id>', methods=['GET'])
# @jwt_required()
# def getType(category_id):
#     getTypes = SetType.query.filter_by(categoryId=category_id).all()
#     return jsonify([
#         {'typeId': typ.typeId, 'typeName': typ.typeName, 'categoryId': typ.categoryId} for typ in getTypes
#     ])


# DELETE TYPE
@app.route("/deleteList/<int:typeId>",methods=["DELETE"])
@jwt_required()
def deleteList(typeId):
    deleteData=SetType.query.filter_by(typeId=typeId).first()
    db.session.delete(deleteData)
    db.session.commit()
    return jsonify({"message":"Todo Delete successfully"})


#----FOR TEMPLATE----
class SetTemplate(db.Model):
    __tablename__ = 'generatedDatas'
    generatedDataId = db.Column(db.Integer,primary_key = True, autoincrement = True)
    categoryId = db.Column(db.Integer,db.ForeignKey('category.categoryId'))
    typeId = db.Column(db.Integer,db.ForeignKey('type.typeId'))
    register_id = db.Column(db.Integer,db.ForeignKey('superAdmin.registerID'))
    datas = db.Column(db.String)
    templates = db.Column(db.String)

# POST GENERATED DATAS
@app.route("/dataBasePostGeneratedDatas", methods=["GET","POST"])
@jwt_required()
def postGeneratedData():
     if request.method== "POST":
        generatedDatas = SetTemplate(
                                 categoryId = request.form["categoryId"],
                                 typeId = request.form["typeId"],
                                 datas = request.form["datas"],
                                 templates = request.form["templates"],
                                  register_id = request.form["registerID"],)
        db.session.add(generatedDatas)
        db.session.commit()
        # return "success"
        return jsonify({
            "categoryId": generatedDatas.categoryId,
            "typeId": generatedDatas.typeId,
            "register_id": generatedDatas.register_id,
            "datas": generatedDatas.datas,
            "templates": generatedDatas.templates,
            "msg": "success"
        })

# GET TEMPLATE
@app.route('/getTemplate', methods = ['GET'])
@jwt_required()
def getTemplate():
    getTemplates = SetTemplate.query.all()
    return jsonify([
                        {'categoryId':temp.categoryId,'typeId':temp.typeId,'generatedDataId':temp.generatedDataId,'datas':temp.datas,'template':temp.templates}
                        for temp in getTemplates
                    ])


@app.route('/getParticulartUsetTemplate/<int:user_id>', methods=['GET'])
def get_particular_user_template(user_id):
    try:
        templates = SetTemplate.query.filter_by(user_id=user_id).all()
        data = [template.to_dict() for template in templates]
        return jsonify({"status": "success", "templates": data}), 200
    except Exception as e:
        print("Error in getParticulartUsetTemplate:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)