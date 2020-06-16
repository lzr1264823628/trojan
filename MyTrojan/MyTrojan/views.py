from django.shortcuts import render
from django.views import View


class Index(View):
    def get(self, request):
        return render(request, "index.html")

def page_not_found(request,exception):
    """
    404页面
    """
    return render(request, '404file/404.html')


