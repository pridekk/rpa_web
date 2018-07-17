PGDMP     ;                    v            general_affairs    10.4    10.4 #               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false                       1262    24577    general_affairs    DATABASE     �   CREATE DATABASE general_affairs WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Korean_Korea.949' LC_CTYPE = 'Korean_Korea.949';
    DROP DATABASE general_affairs;
             general_affairs    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false                       0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3                        3079    12924    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false                       0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    24685    tax_invoice_companies    TABLE     j  CREATE TABLE public.tax_invoice_companies (
    invoice_type character varying(100) NOT NULL,
    print_number integer NOT NULL,
    company_name character varying(200) NOT NULL,
    item_name character varying(200) NOT NULL,
    sent_by character varying(200) NOT NULL,
    best_match character varying(200),
    id integer NOT NULL,
    total_price integer
);
 )   DROP TABLE public.tax_invoice_companies;
       public         general_affairs    false    3                       0    0 '   COLUMN tax_invoice_companies.best_match    COMMENT     �   COMMENT ON COLUMN public.tax_invoice_companies.best_match IS '정확도를 높이기 위해서 세금계산서에 표시되는 품명 기입';
            public       general_affairs    false    200            �            1259    24696    tax_invoice_companies_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tax_invoice_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.tax_invoice_companies_id_seq;
       public       general_affairs    false    200    3                       0    0    tax_invoice_companies_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.tax_invoice_companies_id_seq OWNED BY public.tax_invoice_companies.id;
            public       general_affairs    false    201            �            1259    24605    tax_invoice_issuers    TABLE     �   CREATE TABLE public.tax_invoice_issuers (
    id integer NOT NULL,
    issuer_name character varying(100) NOT NULL,
    mail_subject character varying(100) NOT NULL,
    mail_body character varying
);
 '   DROP TABLE public.tax_invoice_issuers;
       public         general_affairs    false    3                       0    0    TABLE tax_invoice_issuers    COMMENT     O   COMMENT ON TABLE public.tax_invoice_issuers IS '세금계산서 발행기관';
            public       general_affairs    false    199            �            1259    24603    tax_invoice_issuers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tax_invoice_issuers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.tax_invoice_issuers_id_seq;
       public       general_affairs    false    3    199                       0    0    tax_invoice_issuers_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.tax_invoice_issuers_id_seq OWNED BY public.tax_invoice_issuers.id;
            public       general_affairs    false    198            �            1259    24580    tax_invoices    TABLE     B  CREATE TABLE public.tax_invoices (
    id integer NOT NULL,
    company character varying(100) NOT NULL,
    mgmt_id character varying(100),
    month character varying(2) NOT NULL,
    day character varying(2) NOT NULL,
    price integer NOT NULL,
    tax integer NOT NULL,
    item_name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    invoice_filename character varying(200),
    company_number character varying(50) DEFAULT 0 NOT NULL,
    total_price integer,
    site character varying(100),
    mail_count integer DEFAULT 1 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    received_at timestamp without time zone,
    sent_from character varying(100),
    tax_invoice_company_id integer,
    matching_ratio integer DEFAULT 0
);
     DROP TABLE public.tax_invoices;
       public         postgres    false    3            �            1259    24578    tax_invoices_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tax_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.tax_invoices_id_seq;
       public       postgres    false    197    3                       0    0    tax_invoices_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.tax_invoices_id_seq OWNED BY public.tax_invoices.id;
            public       postgres    false    196            �
           2604    24698    tax_invoice_companies id    DEFAULT     �   ALTER TABLE ONLY public.tax_invoice_companies ALTER COLUMN id SET DEFAULT nextval('public.tax_invoice_companies_id_seq'::regclass);
 G   ALTER TABLE public.tax_invoice_companies ALTER COLUMN id DROP DEFAULT;
       public       general_affairs    false    201    200            �
           2604    24608    tax_invoice_issuers id    DEFAULT     �   ALTER TABLE ONLY public.tax_invoice_issuers ALTER COLUMN id SET DEFAULT nextval('public.tax_invoice_issuers_id_seq'::regclass);
 E   ALTER TABLE public.tax_invoice_issuers ALTER COLUMN id DROP DEFAULT;
       public       general_affairs    false    199    198    199            }
           2604    24583    tax_invoices id    DEFAULT     r   ALTER TABLE ONLY public.tax_invoices ALTER COLUMN id SET DEFAULT nextval('public.tax_invoices_id_seq'::regclass);
 >   ALTER TABLE public.tax_invoices ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    197    196    197                      0    24685    tax_invoice_companies 
   TABLE DATA                     public       general_affairs    false    200   ))                 0    24605    tax_invoice_issuers 
   TABLE DATA                     public       general_affairs    false    199   C                 0    24580    tax_invoices 
   TABLE DATA                     public       postgres    false    197   �D                  0    0    tax_invoice_companies_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.tax_invoice_companies_id_seq', 189, true);
            public       general_affairs    false    201                       0    0    tax_invoice_issuers_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tax_invoice_issuers_id_seq', 15, true);
            public       general_affairs    false    198                       0    0    tax_invoices_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tax_invoices_id_seq', 566, true);
            public       postgres    false    196            �
           2606    24692 +   tax_invoice_companies company_name_and_item 
   CONSTRAINT     ~   ALTER TABLE ONLY public.tax_invoice_companies
    ADD CONSTRAINT company_name_and_item PRIMARY KEY (company_name, item_name);
 U   ALTER TABLE ONLY public.tax_invoice_companies DROP CONSTRAINT company_name_and_item;
       public         general_affairs    false    200    200            �
           2606    24610 ,   tax_invoice_issuers tax_invoice_issuers_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.tax_invoice_issuers
    ADD CONSTRAINT tax_invoice_issuers_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.tax_invoice_issuers DROP CONSTRAINT tax_invoice_issuers_pkey;
       public         general_affairs    false    199            �
           2606    24585    tax_invoices tax_invoices_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.tax_invoices
    ADD CONSTRAINT tax_invoices_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.tax_invoices DROP CONSTRAINT tax_invoices_pkey;
       public         postgres    false    197            �
           2606    24707    tax_invoice_companies unique_id 
   CONSTRAINT     X   ALTER TABLE ONLY public.tax_invoice_companies
    ADD CONSTRAINT unique_id UNIQUE (id);
 I   ALTER TABLE ONLY public.tax_invoice_companies DROP CONSTRAINT unique_id;
       public         general_affairs    false    200            �
           2606    24594    tax_invoices unique_mgmt_id 
   CONSTRAINT     Y   ALTER TABLE ONLY public.tax_invoices
    ADD CONSTRAINT unique_mgmt_id UNIQUE (mgmt_id);
 E   ALTER TABLE ONLY public.tax_invoices DROP CONSTRAINT unique_mgmt_id;
       public         postgres    false    197            �
           1259    24713    fki_fx_tax_invoice_company_id    INDEX     h   CREATE INDEX fki_fx_tax_invoice_company_id ON public.tax_invoices USING btree (tax_invoice_company_id);
 1   DROP INDEX public.fki_fx_tax_invoice_company_id;
       public         postgres    false    197            �
           2606    24708 &   tax_invoices fx_tax_invoice_company_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.tax_invoices
    ADD CONSTRAINT fx_tax_invoice_company_id FOREIGN KEY (tax_invoice_company_id) REFERENCES public.tax_invoice_companies(id);
 P   ALTER TABLE ONLY public.tax_invoices DROP CONSTRAINT fx_tax_invoice_company_id;
       public       postgres    false    197    200    2703                  x��][Sז~ϯ�y�����_f��9�0�p�SSS.l+9�`p�������%��(��(�-&�濜Gu�����R��V#���>�J���[{����ۉ����i!19}Cx�����M�|gv����{�;�<���M-	���J��0uEx�8;��3�������~�w�g��fө�K)���?\�w̤���~���^H��݁�r/5 |54~k,)\��`~kj~f�^��A�"\r�����n�n��W/�^��e�]�6��˷�����ٹ9E�d>��5>N~ܔ,��Eq��?KpT&@��z�}�E�"��!�5����E��t�y����:?�|�Kf�(�~���d��"�_E�;[𗷝����-#�ѱ��N�݇�����8����ޱ�A�ݧ��P�n&_���"|�[-F!��$I���ܫ�F�i�n���\AL�ک�^v�6�M�yg�v�͢��� �#���8���!�C%.�����񖋃�ꖻRq��ΫCw���2@�4�1+��'6�w��q�T�R�}S��	�ECWu�1S��l�9��`����m�T�y�P�V��B̺K�- �������'C�P/�����Hu=��pEYR�YGg�]l��F=v� ��\{�=+xy�yYl��;{����#*����Z�yO��a�Ѵb���ܝ*�z�mw*7�EI4U�2ͤ7��VF���p�D�'���G�[�6N����M� ���=ʢ���x�nᩮ��9qj6;e��A8rϮ��w��n鼿HE�[L����"�t�9Xf1�ԭ��� ����(5��-���I8��A�Y��	�q�3/g����J�"+�G%:��^�	��vM��<N�T��>
�]������)q������)�a�^O�O��~
����RU⦈{>�`�U�!������JU� �+�"��ט'6/`5=1t[p�e4_E���:4I2 ��yόu���_jX���91���#�@Ǧk����m	q�$�ί�N�T/�s����<�rOh��Uƀm���"e���[&Dy��eY3�1"�R� �Mq[g*��%�7%+naY���⣥v����1�6��#��ѯ�B��L�[x4�na�kV�TUQd�A*~���B0_Lu�&�}��?!骨Z��96%o'����ڙ߂�z�s�]�)c&�(�EU�����~[&;=r�_�ҋ��7����mjhQ=o� �����1/CV��[[�����S�kF씽l���L=\XL��+L/,�E]���M�պ�^b�ݩBLg.x�Y�M�z���m`�.\E�:FP$P*�Acr�&���������V�9����^��[�GI�v��/��$A~H������5i�������_�T�7Y���&ܝ<	O��-wgթ�e�2
1lB��p�0&����X�l�(�t�>��+=�����*�_�j�.K�+�Ij>�߻��B���L�r}x 5�Y5�ϳL���-׫�:�0V�_�	��W��֮�r �>ܓ$�������k�S-��=R!��1���2��Uڬpr�J��]�]���ق�~H�R �t�{�4�k�~��T7�N�k�˅<�J��N.�T�1(��Z�����Iz>�ƒ��P݄+.�/�9��YAI���Z*��TF��c��2�5�e��2��nR�}��Uow�d?���ֲ�`���[�9/��>�F�ٮ��&�LB��D�E������1����'��������������q&�6<�b���&+�9{�w�t� ��MM����T��r�%��w#����Ĥ*5�jz�*�G�h=��̃���-%ˑ�@nk��o�@��R�����.:��M�Qib�!��P$]�ߛY
K��HY��k�to4�Ћ,r�����%�฻�F����/<�@��[x4v�}�7L����-�[XBLŉ1��w�e� !�DL��|�`���C6�@�����"nA�r�%D��K��G�ȅ��)�9ɸ/�N�N�)�G5b��ɐ-�I���O_�`�q�9.c���=3شW��<�H�Q��?��l�w��=�5%̫�8葌rs���q��?~d6�8�=^�`�����T�oI�Έ��1�i�\�+�3,U�B���Y^�$�h�>Ip�5��V�lh�
W���$l�m��@=܄�R�,Ì�ԏ�8н#a�F�ӰC��7��HA�_
��FK�:`�H��у�;��sTk���#1a
�K�n�݃�/�*G�e@ʋ���$��� +�����do�o��>����;YL<�ڎ�ժ&��1("��<âg�!�S�O�~7��h)$��8B1���߭��J+�A4ɱ!�����,���Y'�����Z"q-5qE7L�a$����8���J����YR��,�q�ͱ)�%��?��9�c��!)$�+�{�,��������*|�F'�-ɫs�Rw~~;�;��PJ2+mCIQ?I���#Bf¢��%E�� ���/9�O�m%/[k��:�y�j,���z�"�$نs�y��!)��_��Ʀ��B͵q� �6�8" 1�%�#
��b��lzbf~���b�����t����|���?(���5P�ݵ������XH\ݠ� 6%h���h����~&��S##���6���y��벦�C�&=1���Y���F�^�G�F`�&ʆ����$K}�>�i~;�b��@v2���ۧܽא���������R�]��&F��D����Ϊ���o�~�/!�Fv}MC��H$�?��(��B�����I�r��UŌ�$�$�sR��@b���j�Q�� ��F ������.Q���X�}]k�ъ�'{5�-,�e�802��J�B��;����.�mF.ДP`CS��A&�*Z���7�M�����/ս�
ݵ#W������� �5oZ�:�����x�-�|p���u$S��\j2���*!@(�x�Ϊ�N/���FS����u���*�T�C��7G�k����?�Ӣ��#�>���p��:s�sP�����.��7�Y�x���E��-���sg�A'�؛s��Po��up]�F�D�_x�3lb��m�3����?F&�ć��4�������VpwV[h�}�^jii4�-c�op�1�t=�@;�t��Γ������ Ҫ	0=0��g�3	(HT����_��$@�6ȵE�'�L����mo7O��;<$���9PtK�-^c2;=�����{Ew�7w��Tk��c����?�1�٦`���Rց-8�u���(t���p?�$���)���)�6���C2�����W�f�2>MR��9�#_~)�0��pPذ4n�A哃"��\/Ѡ("&R��):�	]�fD�Ss3�o�'C�o��@�aYFB���˟�����r�?		[��]�T?�Bz$i!U@��q����[�i��+�QPޑ��'Y���޶iYQ}15�}l��=+!Iomj�.�2���8�s	Ye_j�����_j}����H�a��o;Id|c�����e�z�|�"~��2�P�#��u��c��o7�䏚�}v�����@�BB��CdYuFu�sx���|�%�R�1�a��ub*yG�2�qnI!�Ii,��Ǝܬ��o}����W9���]Vz�>���*sZH� �`כL�z�g���{���~yB�}�6s}ڥLo\���2�ګ�{cq��\��OC]15E�$�qj�0�T��N�ix(9h��2C�\��T���T�[p�T��P���GPF��������5\�$�b���e��1���vw����Cs�ٻ3K�(��v��2��_�݁���-���q�`��$��#�QbĥIq8K�x�:�Am�7��r�V���K�h��g��L��i?�J~�3��� [*o�h�1d�DW-�V��h/\n��8�{m!��ĺ��?�
e$[t�$�ȷ
��a�U�jIX#�4a(�E��WX2���:\b˛���t�0*�D��TS5y�� �� �	  r�z�Ï)��}��sӈ�k�W�8*�����J��H쇃Ug
�K#$\~��e"�eA5QtC�~Vaa��l_>����hq\�PLݐ�?M3��}-q��(Ct�zC��2j.�_LK{�il(`%��Vq�QUb��Gz��z�\q��lt7��	��ǡ`M���<K���#ϨLp:���1(K��w��y���qN_�B}E�K���!�b��@[MCSd��A]Uma�N�A�W�
�8��I��dh7�"��N�5�)�hϾ�v��v�>Jܢ3MC�%)m��F|����'F��CL_�D�2��2-�ó��eYn�1��;���X�������2v�첳r�1[�/��y�jDM�4	���
J��w) ur�����3tR�	eY����|�/�K��S�~���	|��c�*d�E��M �Ί��GJuF1j}VUN�y��
�7����[�eI���[�9�z�|�����I�6�εl(uD�F����$�}��g�:�8�hzFSc�C�ȮT�Y�����r��p�R�� ����=xb!�Ւe� �\[($^Q�r c��>�������[�m�!�Gj~~���b�^��P��li���41d�C���d���bF��&��7�%%�����H^M~9�$jť�/)MuE�e]��������|8�h��B8����-R�v�o�⌾$�ō`�[z0;�Jݟm���( �������F��=��&�!~��MY3�����"���ޮ���}�A8��|P0#�8\��j6����;��%��\GfHn�-B:!D6x �u��[t&(��Y˺h(�9w`;LY��,/�N���f��մ��F
7Q�d�s�9�~�L.z�m��1a8'k��_'��1�O�D����%Z�MK���M�N��_]��M� ��i�u���x���#����u���\,��ʲ��--�5o��v�(=I?���o�u�*VD��K)��Ş��z.��d|#T�5���eS�d���w^V�cy˛+(�:��J;z�ɴ:6f�"�����1�m���-5pw}|Y�j_$����y�K7I�Yt~����&�:w�:y���-��Z�hk��t-n`�W3�$��� }�P�w�Y��7��zkeal����}\�Z\�؀���<��=��Ԃ1U<^�����|�,�E@�Ե���	�Z����ɾ	:.%�q9q&=�0/$S����l��5^{�J�5Ȏ���.�{[���D/����o��^L�cTb��h��:ЪCm5��XO!�����B�8,�}�sڅ.0y�� �`�6Sh=�����C�Am]��T��)#j8�Y��݈�gnBBb����,���yE�7B'!s�E$е��5_͊�]D\�->RLR���6씁~�ך��d��#SF��GKB���&�d���%��`�Ly'б��lK��N�K�U��\!�;�p�E��8�$2�en�Y�cW�:�k�Ќ
&���ǿ�{���]�I�O�v�r&� y~��#o�ݼx�H���J��O��63�g��i���f��?h�Ɲ�Q�_�%FFZE��N�H�)����L,{Oܳe[a��N��]��q�uU��/iK�~�����B:u/-L�ҳM�Ӈ��l��H���+���v��[]u]�Z!\�^v� ǥ8�.�h��EɐPp(8��L���w�L'w����O^���Jb�ˌ�9��'�+��-%���)�"(�T������2`��X�4n~&�ӵ��;bM�oY�*I��\Oi��Rv1q�,���d����1�V8r���S:��k�`G�_�^��4�g�f�aD^E݅Р-�u6mů�HB�����CyLC$�7��g�	���s�1��.4ہ�e��|S�[�-ڑ�ݜe���f�ޢ��#i�t�E��2r"I�����'�!'�o��	�)�'ȳ.4��{�I���Ӌ3�S�4i�`�f�~n�RD�x!~��5��?ޱ^u=��:��x� ���*�������vh�ca+48en���J_����E�
�"���=SJ���C�	jt����d���oy]bؕ�����?�]�<��O�@?���ew���>����4�>����O�#!�J�ky*&����;�����A����_�X!��B�ɍ��QB���c}��o3�	��a{P��qZi>�AH��H��w�g��}y�	��_ ��-\R�~�7i�lU��߇/\��M�@�9g6�h�:>���Z	,��us�6�~Ol�p������Q����6�vs�����_�Ffݖ��b�+���۔��Ӄ�����%?Z0�.y}�/"5TR�6��1:�I:����#o�l77����v��^�8�v7�[��J%�P,K�^ hT=w~���;?8T!��$���t��L=�׆n�MQ���&��!�3�ZLʞ���#�	%6�D�'p�Y�/^����n>��s�b)l�����b��k         �  x���MKA��~�����ZѩC!Һ��:����n�MdӠ.����^
�(�D��ztM��:���g�������dsk�y���7P�Q4�b[�/PcϤ*)P�b1��(�/C�I�2�
�Qv�j�n�Y<�������
'�H�-�)T�$8s����{/.�u�{.�شpْ"+��0�8��:�qC�������t��ު@ǯ�����Œ,�(өFH�� .�<�a�w����y���j�v�7^�f�k�H���j�bY�@M+931{�*�N\�y���T4�����j*al��/HiҀ��j0���b���e2��(��bU
������A��Z��T�0pa �@���x�ƻ��]��X,Y��Q�my�+6.�]�`%�N"��'g�����=����q���#�d��j:�=�s��|�&q�>c�J            x��[wW�.�~~E��!�~�y���.���ap��ؽG���A!��ap%>��mj��ȶ𑻰��x�c[��H�9�/�5犈�X��"��KfWg���ŧ����<�ڱC��~���{.�8{�dri�����Ο>�����������.,.8�;���K}x����K����Zto^����\������KK��ˋ�ܟO^\Z���V�{�\���K�W�G��/�;�t������ӏZq�������//��|���..�\:�^�����K�SϟC2���ǣ���N�sz�����K�Ͽ���K��q�Xo?�b��o��'���_�}��7�2Z�3���>�����5D)e��"
����j�I_ݛ�?F[뻏��0��bt{g����'kÿ�]�دF_�����}�<����Zb���0�4�����O/,���?]x��?�8}�,W��~��~`d��>�����i��y��)�Z�?S��@c�uﲢQ�G�W`������Z�/y���?O3p����wO�ѭ����'7�k��g;%�hέl�$`�����_�6�Fw�|4Z�������`x�C���7^�p"�QD%��V����6�Qè �I�Mjj3h��I�d3�Ԁ��yret�����a��>����� :Bp@�1�>���}a����i[��W�G�~>��(b8O5��z=o�T��Lp�E�H� hB��!'�.r�8?����ݟn�n�}v���{�hM9��W�?U�N��+|�KG��S��� [�u4���ŝ���'VɎP�1�X�'�OX�&F捞�����yK�h��Q�@�5	65�h8]�v��`�_:qnq�����Kܣ�7C�G#{�U�s��:� `*A-��!�X���I�e�NJpc�j�wR,S�ΜTdX�On�B�Z�	S.P`���!���?vw�_8zpw{�h|����~�=���#�.0�p�5:���F�"*��O�6���x�ĹJw�&��rj��3䌯>~�9���;#����P�GY���}����x�=ڸ��Ӄ��?��6{�S.�I�X7�M�v����o�B�+bx;j�kZ�jjP#ᑯ���&�kz�$���k�
 ��\L�	Λ/�=�L��eT�;�kl+T������F�sB	$a��'a���D��)U���������6����������<t:���I� �~�؁�x�7���>o|m����ҏ�>�&�N��~`l�!.CDJ�uWQ$Y"���E:Gѷ[��?���o���]�B�������=(��8yc�e!y�u�(^I\��/�e���hP#	���T1«1bQ�f��H^#߸��뿌��Q�����UBb���O��;�����͢G9�%�=��v(+W,��E�%�$��ܪN�.P�X>;����Ax��W�o,>�R����i��������@����ϝ��� m�:�o��s�����SK4�̹��А���Y����b���7�o}���r��
:�t	����ף�����7׆��>�pe����{�\�O lqx��Dr���VwL��v�����!%]<�oi�i�#�e�t�:ѹ��9��O��{�7�%e��F�PRi��/��G��67#]Ȓ��p�5����@�R����N�-�x6�<N-\�J�����\� ?:a(��s�L����߽�#(����ѭ���A5}���H�j"R�p�CǦU`o?06��ّq�5�]��Z��\z�h2ˍ�ГW�kky�'͐&j%�z(4y(�.���O~��~���ˎ/�Nr��	�DvN���k�����7�a���J���_p�!��[Q�9��f'�[�@Ri`��ԗL�C��3���h�j�T�St�>��JAЁ^QG��!��c��[T���2��:�u!����J��5끶 �X*m�����\qN�=��TFT�������{v.��CG�^9|�w���z���\��Y :��v.�������BY�|�e���$Ȩ���강G���\�o��d3"���]ҫ4���>����_c�!��E��ߎ��la?0/�4�-��p�jݷ��3���"�wp��ړ���o\��'��1�דO�'M�����גi¸	�Y1�f��W^�c��w>��>*!��jct��Nhc�����sKp�����-�w1�܇�����	�DJ��s#<����j�Y�ؿo��o�;��b�����ə�Xςpb�A(2g3��o?^�qN;�����T��-`^E!S�nm;�������Fh�VN���ƕݝ�(]�Ol�ɘ���&�8�wT��7�;�Z*�ԧ�������9|.x�g#�s�RN;!5�=tE�� '��k��]�� (��~O/��?����r��ε�q���^�j��`oshl���d!�1�ϩ ��m��,�D%:�ŘV�)�S�v�A�K��q���;�k�)��O��z �0� I9p,}�w��cP���f�P���@J��Z�w������Ȱ	D�����vZ��M�Y�#
H��l'<C��tB�����WG�n���Z!��Ms�2Q���^@j��%�0��:�O�M!�M��J
��������"6-r��ۺZ���U�ː���`b��͕(bK1���a�W;&Ge%Σ�F�������jom���ݾ	�^ދ���g����0(��l�c����J[�.�+F����T3���USS��z�����'p�m���.���c�Ҍ:N�sft{g<�vO|xmt�I����[xW�<��wf�l��!&=?�q�B,3�bʝ�	1$����Yf��b1J'ն��5�*s=�u�v��c<��x��0�۽�6 l�vc����m�E.p��u��`d?�0t[��F�L�n��ޅQՌ �<ѾS
J!|�1�M1������T�w�2�������Ê�K����߸7z��?c�#J���r*���h��MsP
G%K	i�dE�0��Y|��AI���0���z�Q'K�l��FJ��ώ����t�J#O���{�,t�W���G����엑8����z8�Ɩ���e�u��\Ґ"�C�7�<�2,Q��������Y�x!s]��'����&������OeN���U*hZXI��������eg���@���G������W�^[��B�؁7=Π1�xЃ?�|?�z5���4��ƕ�I�Y�o��~ݍ���0t[�&�^�}BOG�F焹I����rA`~�;T_�\���A^�iǨ}&�~�a�Q��f�O�+�R ~�@0�#4Q-����@���F 
A�ً�z$,L�1�gB�����φ�$j-��{�����'�.�^y�ȱ=Q�LqK��[ �F ��w�;h��m���t��^"��r�c?�GO�o�d��ˣ���PkTxb3EmJI����û7��>ǳx}՝нW^=Zd����%���Z0?�~x�#�@��
��bۻ�\GH�����8����#'}jce�:�,�n��H,�½}���߄�y���߿~�����h`��7�ymw��s�?��|�#�1hQ+#�ñ�^��)��X�#�� ON��vA���(%_����y>��=(�
1���%�c���9�z�L׷[[�Ν0]�v �5f� ����7v���)N�I��.]"c%���j�����P����t�W)�<��p����>�*Tդ���?-�ZL;T��5���t�^ϩ�{D�y)2��r�@��KԽ�/�@�k�fotw0�~�����D�+�SIe�pZ{O1X�7�+��\�c�0�Ň"�تj���N�Y�5�����̽������wFw�\ҵ��_B�RSq$bS�eF��%�. �^4�rǝ��ؖ�`aۡtt{c������ �������~S Ǡvr��7�wү�d2�`<L�l���G��1��S4��v �!5\�i�c��q�;UsY(�T8)>B��,6��Gm    Q�4}-��7B����h�J,�"���ڶ�2js��`���Lz�8oA3^��3.[1��*�*�s_��#oŜtq�����d%�������o�CLk��2��F�����&�&a"ΠEQ�e�e����6�1�?�y�V�$��[�i�Ĕ*8�f����� &�=U�"/%��p�������֝�B0��&�t1�.��/��t����R9�@��r�x��x|��I�
�dd?�0>M-)R�]�l�gR��新극5��
�`���RE�S�����{���j��s+�ӫ⁈��*����V�X��M��z�6IS��@!��5H[9�x�V��o�_w_aB���¹;�s1��_��?�&Z�i0Cɰ����c^mvO���WN//���_NNfA�A�zp�Y	������o8��;:�>��=ww�����n_}��B�:���sd��gVᙋ鷂S���88e85�EtT�lW�i^��>=��\
�*9��E�Ʋ��Ӳ�i���A����O��<:gvT�MX�\a���9ۂ:�H��4��zI[P:Sb�}"��^��s5�����ԥ v� �3��p�ȫ5e�ڙ��ϭA����b��欍��7"�r^�q:@~3	����:*ZІ��ԇ�9Of��B���p�om��탓��$H��^������(��*���`�è�\�VI1�U��୹�($ᆢ�hVHj�ԥ�P�d��&<��J���Hn�$�x�z��������G�:r�?$�O�.P�<�N�1�#�m�}
]����6ѶN�;�[��(���0�S8�&N,:�g��<��\	��n�j��b��*�g���X} հ*�8)>��S�LX(&�ϋ���#���]�t���s��8�
c�<aLE�С;+�ׯ3�\N	��z1rk��@��V�Dٞ���˴�>�]uy�h��:�}x��� a�j`o^0̛���������Й=P��,��-鐶�Y��[�%�g�^<%��3�����H���p�[@�/9�!�,��k��u������8ȍi��d���\��(�A���\�q
�KS����pٲ~`��ڒ�h�TJQ�X/x],���9ƀ6����)5��O�b��<լG���<'�{ӏx��~�'�7��UtfWG���2���V�3J�K*�o�<p[O���RY���3U	�(�t$8�[։��� ��ܞ���%�}2�&F�W�2���>z����ǣ_�e�2w�1�U޳`o?06������D�%��I�-��5ʞ<�xH�lOa��pR�}kx���/��՚�>���w�Y��iƐ�m0�!h��]�D��*a��N_9� q����k{Ə�..�n�Ï��?R���53�t�O>W[�
�?
�bcY�<�\y�9W%���K[��2������
��V���B&[��Pv�7�9�L$�?}4���LZ�����%O,iE�r��:���oo�~�lD8P+�
�'�t�ǯ�,��3�\Q��iX�M�
����m�����|经�b[�9
Į��!H�����7_9��1l�f�7��s�����,�7��s���N��n����-jMg�9j�c&Հf�q�� �fr��ұ}��5�q���*�oݽ�!Br�%G�o�3w�!�$B�m!�<3�y�!����>��������O?�_�RiwZ�m1��%)��_�zT���E��d��#m���1���iТ	3�dɄ�jK�Q�f���O&�g�������A?���(������o���p�����G*C���Η.^^)�+��
���H��D0oc�9�3I�:>���u*�!]�᎓�bK��זs2�����(���O��c�=�l�\�#�)ȯo�>��M�F�����(^&A�E�:q�G�wѯ�烊}7�wA�Y�����Pž�*��	��]()8ժ)c�����1��\�䅬`�G��ے���Ϩ�P� 6y�Np^�'�x�����b{��Usv�����%����e��,6�J���V����
�e�R�|>�b���hp;$*ժ�S�]�jo�iG�#���W.i`��p�4C߳o�m�_A�9ݘ�t"�רݸ��N��m�����M�QB�R*�,ꍩ����N�%r�%�刞c9�o��]v����bF���1���O�Q\�e�i^7���Xm~;�<�ݾ��ϝ�!���0}��4(CPUG�����~`&b�4J�,�H|7��[2L�D8�6�ggb3����>4�D(-�T���ũ����1F&`ۗ��^ ��st����w���]X�;����h?>Y�t�X�h{���~`4"N��"�#��D�U>�`�Zvb�~S��oQ��ݒ�Nܥ��<4��S��C��uv�����Oq"���w��Ϳz��C�UᶟDE|<MaB�~ a�ݍ���~��~�����wkT/����}zv!�`Q+K�tx���ŵ�^�e��q��M5�H��K�3N����;y�U ].l��	����ƽp���[.������x)�������·����<s��EG�{b�E�
Q���9!�LZ྅�\hb�}k��V�ԃŔ��(p��[��:�;5��)k��� �2s�iF�χvPlM\!�������@��qBL]X�A�bj�]���P��H�*���^�ak��U�X�y�aĨ�3^9�zS]ޠu1�4X��H��C��9^}0��&L��y�=i0��N�q�Hȯ�oT����С�pV��V�w��i�������U��*��'0��N�a��[�"Ȱ.�w���G��\]�aac�d�9��I7^ΰтۊ]@��S�q����u 2F���_|NUXpܭ��ipVHf;���4�
�՘���֌
��<@w^BjxH��s��%�"��M���7�� �aq$WM�Jqk����J-�&g�BtM@������J�"R�(V�䠿po�yR����!+2�V�_����+/�H�6�������4��>��J��,�fH�%��R��H�SZhLh���f�[����vF�zm|��~��\���)�6!gͻ���.�$�@i!�������F_���{1��V����.H�Lo��~���vMhuE����̜�匊��h�Wb��)��b$�>�^�I� ���]�N��;@>���~/�p�g���ᙷ��;�Y����峗N|�=���~rb��lIvR���د�/�h��T�w�r�:�1�	�!�(6�[5W$�?�Cu/`�}�'�`s�x#,����{�\E�n٨��B��P-x��K�o�F�Vݑ9����:Z3��%�|Qx��Ao$�[��.r/���p9����m�&^��V�ذ�����@N��ɋL�����Mz,��IB���Z��;V���x�4���YG�ڄѺ� �d��Y���ldY�R���Tw�q���0�"ᆇ0c�P�3EfS�L85��6�0?��OA���EJ��*����l�7�����*?B&�-���{mY(�'�u�g�e	`sc�@��m�Q	 ��u�K�i���	�`Fs)��j��uD �l�U��\2?�Z���?��ʹyM�xz~�����!DLa�Y�%(n��g`� ���#$��Y�Y\*ɯ��t�'T	n;N}Ƹ[hj3wK��-�
�)f!{�3t�S����dS��J��o��b�~�n9����E���Y��^�	�e�h�>�V��~`h��>�9¸O0���eDK��b���y�Q��ᯍ�Ef2R��4
!خ4�$7�x�W��:��CW��c���g9��FG%�e.El;��Ǡ���Ai�W��Y��P��4>�Y� ���dҖpl���-(�����m/Pvw0�t���{�fLD�< t#�%�󄥻���x�b^�4,.v$�J[�u#`Q�2/�=[U/x�j�/f���E��i�&#{Ǧ;�l�4�!��l
�u��>6ݭ5c3��6l�L+c��tdm��l��p�om���T���V�	A�    �L$�L��b�KG��{A#�Hq�m��je���>�}�}*&,�A����@��_��Tc/�f@� 4�h���!�Sv4��D��+�"��?,-/�>�t��G��N�6?L5>�bv�8�AeV������)�lC���
��7��k�=D��A�/��DB��N
�j��1֘F�<O<�����.m��sgiC�W�g�����m>�P����1h	{V�Ձo�Ԍ2e�Ih6�~ox�&�m�"�����kE#LB�<��G]�	�ufe�g����T�[��X��pb�e�6��|A��r�X�kQP�]����>����-ˊ&`>��@���OÉ$e۲�&E���eص+
Dak����֐�k
�`���E��O��h�N��g�憅���0^@��������K�p��/Gg	�m�Fa��4����3cM���m�3.�L4��1�D�����q�����V$��|��柃�3.�rO�m{vw�������y<=TELy:��}M�y�!�z�iX*ƙd�H AJ�T�Xb�+���/�8�4���^u��Ϊ���%��덉��x
�{��7�]�^�5JM3U������ <LPe��+6�q��/�� /&0�����?]u��JW��n}�kF�x�w�Gal��D��m�V��<��g�hA�k&�	�u��a,��f�������?��.��3^[}���)��L�S�bh`#S�	(��L0�Ll���<1��:I��)g�3"� ����k��k�+�ԕ�F���y2������Sh�����s�:���ţ(�1y�1�s(G���ױ0�MUl���3��n}o�I�+�1����o��Á�W��	�|���6	Qj�����R%D�`�]G��I1�f1B΢usS���HJ�C^��p�?+������%��8h�R'�5x	�K�bA�����ٰ09G�xV�T��(�ZN&�s��Kr�0���������F��)��qU���J"-�k���6��3�{u�3q'��f�0Jle𡑑�5��k/u��CZ����G %�G�v�e�2�:6;<�����E��R�C�DSZ��;�����?<�-f.�~��_Be���ֵ��B�؁7{�^�1�������ݟ$�߽����s)伜+�}P���wЯ3��($���c\��?�Q�";j|��6�|bo�.ɞz��c��vρ���.�<~����z�) q����8�\�+eY���օF�Yi��rR���'f�눽	���6L�D�~���>]|�g�ɷ
��f�^xLW?�������~�jY��,D�d��oa�F��<Ϭ+B+l5�&4�Z��Ҹ" �/]8�����ޞ�� +��q���ˍbtŭ��V��d���_���������w��W碽�G���wbr�in���i�	or?��\(d��M���L��\-�l2O� a��C�%|� ������mn��C�#+������{���w�z�`�7�����Z}�'diRٽ-�P�|CM�C�-l�Rv�%Hk���VV �麲E��BZ�)��0&�rt����I��	cu��u ����'��]O@(\(Rw����0
(�T�:�2��M��ԉ�(nSRQ(��i�8�P��^l�)	��4�Є¢.U2L��j.*����ֲ)I"kU:��֢�"�L�ښv1�!�CN��K�Ω�6���p^��y�������9x��o�*n'E^Z�����/���q�g�a�C&��!����D)RVw�q,���:�^6�b	tok�R�rh��4~�^��*�,��g �s�1y�K��[?�>~r���w�	1u�n�bV ��;���ȩ�G�u�?b��[��$�f�����3�8ͦ�yN�h�;J���Xg��%�]qU2n���ĕ�;�΅��ɯZp��Gu���^pu�W�e-�
�+�
VA�t��Wm�2{�����@�Z�g��+f=��0�.��5�A���ޡu���,��tr��OD������6hu<C��Ђ���@K�H�Ǟ� Z{<��n��7|��|N�и W4�;��W��mm�/؃9�[k��{������gNrC�N�F�=�^� ���*��(�`j�����گ3��Ԥ�p��)Orf��V2/G�B�l�ř넶	���L+}�O����d��}�̇�Z)�����ս��t�����D�]��
|ɼ~�m�.9qf( ��5P1������w�api.�߅�5g�j�#�������8t�d�t�S�l�;�"�+0�.�g���	u�������A�aȊ�C�_b��
���Ml*C�s�<Ol���û��	���,��eݢ�g+�߯��gB�1~�؝��ˡ�CϠf�]�3�u����?><2ؽ�@�������p�V>
^�P@���_Y:�����ȣ��Zk���:� d��pBq� r�Bt
��2�q��-:�XG�M�[���L*��Gॷ� &5.@�.��؛e])����2��I��E����ơ�,-C��Լ������↡����JgX늵|�c8����{*�V��S�b 7��Q�"�Rkґ�U50
1�.���RB���~�D��F`^b8�蕢gk�H�	o�����>ye�v?�2ʧ"�PY��y W�I#����~�"�<U��HT"�l�M�[���E�2`���|S�`J�̠(��Q"���V�K�vj���~�:�<A�'��t�� ~��M�g�^�F��8�th`�,���G��>�%�-�����6���_@	YASB�̷��6�<D���T���Qp'��V��=|���7^���Ww]mm�7nz�"��u\f����[����`��b�շ�M)�6�dm${${=ݐ�b��K�0Ɠ�
��(��E�J�rcO^~g�6w����.0��J��^��uɾz4ڸ:zt{�Ѡ����p{�e
=(Z����6)J�#C?�q�Mxm����
ID�=��n'D�@��9b6C$�D��d�}���C$*'k�OJbW�8 �~��싓��ZL������l�Y�8��GW	��?+����7O�,��t	gt���@�v ;��'t
Q�m�	�m��ꍠC�5������	&�)8�.�,ĶX���혜����o�n݄��7+q�c4xƌ"���!z�B!f`��SG�po�����?z�W�)�=io���"`,%Q]���H��.0bA��h�2(�8(j՞�&�!#��p~�K0�B�68N�w�{�2���p�K��b&l����xfG�����)�z�f����߮�o�>�����>\o��R6 �����Y�=ri1W�V ��O��f ��8�r�O�ʅ\��%3L:��R�0����XC�PQxz��p� E�Af�ٔ�dU�֦.���&Yu��E����#d���U,����<Q�P66��^`X=��|��8O]��&͎�PX�T�ǿGϟ9��7�P�r/���@[J�3�F@�f�v)�U��~��Ҳ��&S��<��r^8��F�(��䔧"R�>m���LZ@2AuA� �U�p�� �0�qc���_���k�=,"a�L�l������R�I�4� �(z������j�a`�dH�D8'�ĦU� �ܝz'���o{�ט�k�IBϰ����ok���⢵�
�܁�DA�|��<V��~����E��IM�W�p��?jysH^J��U�t <�Z:�X;;ې�P@�盍ѧ\4]8�q����?x�p�&�%«Al�Ë/8�F�������ã��,C��p�(��J��y�pϢ�]t/�,���	׷!�<�w߻t&�W�t��t"�M���R�tFo&�d{��$�eŤ3Ǥ��Β�N����C�;�vw� xޘ,L�u��A�F���}Op/����O�S���po������叜�߃jr�L�:G7s�u�"�h�x8
��mI.=Њ���/��>>��Aa9���`5��LzY��(�|ѽwb�.�h    �e��ٞ^�/z��8e��"���Dl"u<EX�[�W�����$��s�����AĊb����"���/������@�T�$��^��b���
RV-Ό�ԏ��\����L ���;x�_��vz0�{'m{Ao��y�J�>�BU�����������~qE3A�+�fhb�����l���ӳ���v�����1_yO�T�p>9U��|:�4��w�u���[�E���=�V�o{���h�!tݽW3F��Mi�hl9لXiiwpw���ւ�~��K%�hv�5+�c��e�ϥ�^��v��������D��x��YR���_�}<Y���*<C��:9��& S��L��L~}s��}�!t��I�.�������~��eZ �����&�m}��+YW�H����\G9��vq��ǵ{0�����i���a+��7�0��E�?0|uo<r(ۇHl�{���d�^�,JqbAr�ߝ�!�.�����~���:s�.���V`��E.����#��Ъ�fS|�/�}���JN�s?`.�e��;^} �b��e|�VYN�Ϻ�?��p)����<r����K��_<�Ȁ�Sf���QLWԆ��덃ӓ�R[B�+j-�j��ӆ�
�*�����qk�Щ/�L&�o�.x����R�����tyI�l�ͪ_G.��t��;�/�4��KIDWrH��~�� ����=T�Kv)ב*]X%q��,� �[V��8A	��D��3��v�M���t�E9l�졋@3�Y��Q���bcw>*�\Ȝ�DUӝokH̺��A�R�Պ�=��"8��I�WsJH�p�vpXuJQ���B ���逪�JYU���-�VTiC�]YW��	�� UR�,����������GPO�\d��ցK�X�j����wD��<��Um�
��7�-ro���:���VU�X���=��j.**/E�)�ٺ���<��U�E�Չ�;lj"�� 7� Y�hs����U��z����b�?^{�u
�c)���,],��^ѝ*Ǭ�po?������t�n�>9�H=֣���%�u%�V���َY�HH�TÝ(ۆ��
?����~��Kdۚ;ϖS^�`HJ��� �>~�q��び+<>���'L =��e*������7�?��@W��ǒ�3ʠc :A��cVW��\F\�d2�����2�[��B ������m�����l0��o��9�W�_�_�9ܹ`���!�y�t�J�**Һ��(�n����_c����hk���F�yR$F�Gv5���l/��҉,E)dT1&��O�P���>/�D�:Z��N;�r����R���j��ɋ�䊃&��(Bo��=z�ᇪǫe��^�9��Q[X}�wᥨ�Q���K�D�����:�TFP<�6�t^Ĕ�>���O|���\���>/�'����\Ay�t�^��Gl��]��U�y�r�y3/���R	`�+:�0�֬']v ����W`�,z��%9Kx�Mhz�QC��EO:5lr2�J�(B������3S-��	�:!�F,b�pD�(�,�N��^��ӏ~M���ʵ��ސ��O#}F5J�H���*�U0%'e ���l|��͔W>$+엽	^ ���5���E�?z���@T2F����o��F�|��F��}�:Q5t��o_�Wl�7*����sk�]�\�0���Rs�<�>�'�ťK�/.���~ڌ�prNNLy!C�|�8:I�K�!�[�Ϧ���e�*]4-�I�TQ��QE�
�6��QU��e��_c�'�mjoش����t'���6�1{A裏>����d�@I_�<�����t����#/�b'�S�p�v�P��]���M��x&�S˰�e���ki���m"+Q�}s��l�|S��D�����_'_�1�:�f"I�(8�Х�<�Y�y�z�lF�7�ӯ��Lq��-��ã�kou454�b�_�x�kɸyǌ�ma�R1��S^r�bg��(N������XP6�7��ȶ�O_,�0�4v���Xyv*��8P2���%|��,��aY�SK�V�T���� �'@�N�V��l)��\'Rv�\���D�.X��gi���'bg���JńҸ�]&If^�.�6E�^lˤD.|-�;�-B������}.��w��NU�����@�T)����ө�t�[��ɏS��5�R����$q�Ґ-�(x����g�2�MM��Ek�6j�w*Y�{&/6dS��Ll��AAV�+f�W��z�	��!����*����-�QA�Fy:&�/���><����{��#�b�%�q����\��b���,�:~7�Ð�`z9$�֭qm�:���;�p�[�� ^c8\�/U�p`�h����>cpPNy� `�&k�`G^�5�E�2N-�A>����̑^�/����j�;ۍ�I���� �:�cxL�-��}"�}�T��.UZU�ʒ���B�4D%\TZ�X�Y`-�B�?ݘbF�H�\  a���pg[~�P?�0�0�&��{��G�)���[��ϻLC�����5���|��,H�P֮��rQ�BP�g�v�?v/��D�j�M�U!�6�Nڶz�qA���%��+>�d{��=8���ʅ|j��K�X�{��;oOY�+c85���½}xf5�{/���Ӧ�;��剱�f]��Y����X\KӲT�<����H[�aD<�V�+Q IM�t���mե/l�H�O�{��9|n��.}�HU��>�h��j���_^��M�>�A�E�4��P�^��V���|�	Bv�5��RW�=CNr��,�|޲��^Jt�D��Fn��=�F)\�����2iK�q�~|S�ȼ:�ګ��޹�g���a�^u�?萶ջ�o1,��v��G@eMRbx���`����'���8a���A��Ӫ\�_x�˗?x� .�G����j}��O�D�f�����`o��X+i��S�I�J�n���M�,oq�,�z*Z�;"g�����Q�4p"��w*�n�m`�����n
B=�y�v��E�4bk��M�M�Qƴ��� �U�iw�u��7�⦜@`��_]�5��e��&nn��7ü��4�/�Z	�G��
X`x^��Ǣ`�0���
`k�.
40-Ҿ��+P����v��	�4lV��-���A�)�}q��M��*�68s� wأ���{ĸm�X�|Ĩ xJ!aO���P�
��T���L�P����T�U�C2H�xi��U���ぺB�ӀU���;��E�9�m���;e ��E���
_:J����X*��\��{�=�7���p�E����7=�B����Ԑ-)L�����ֽ/���F��XhJz�d�l��孹�_�� 4���'���r�A�醙;�����|��[�c�'��A	2���x^:{�4��K�]?$%c{�af}����0�JF�V1>��ZI�$0��_��wNSX(ֲ�T4�*�+�Y5�ދ���YF����g�I�&�g���s�0�7<�'wp����`x�^o�����n�v�|S�f*��J��Tu�/q�Q`bN��X)�njħp��,��O&��a;�~���w?�d�T��&�'�Mn�/����`bb�O���2�mo��ξ�c��9,��O=�	6�o
&��2�Y2�<�IE�<ߔSN\�Q�L��z�&��W!�\�q��Gõ�y�����L�ɖ2�
��
`���٩.�϶aT2.�L۪�w��m1v�.��	<
s!0�r�Ÿ�?���{���Ib��'�LaD YZ�0��|�½�����/-�;�f��Ʋ�"�H�~���심p�\��fJ�4Ka��0�@�YT>a(O;�j���������x��sOkx�����YОBm+�r�*�po���.�>��>^�ֳ�9�N����
6.���:}�2���q�|66�a7}�g��Z��k�J��,��A;K7/�����L��O����L0�e����_���yr4�1n�����~�B�׀)�֧w�؈)&2�G��"�6*�)њ�0���l���Y    �2å-b
��P�1��P.�Ыo�W���+�?o��%zH�XS'��Ye6"�lMd�b�+UP��&����ah�<��Z�V��}����^�$`���M�Z4.4$����줃��ogs�	�bl{�	!]�T���:ƺTun�� ����5�*���Ơ`���9�ds��BҍKۀ��d���06w)4@��BJ�|@�}�^	�&D�c�bN?�% �st^K��D/��&L8e�(8}�8�O~�i���`x�j���'{ׄ��ÂK�s|�+����NU�"�$Q�t,���}a���[{������$8G����h ���5CR��^�0vfX����W�TV��á��رoV��+�0^G��j�7,T(U����m���.�~�n����]�h���'�v߼o��j��~�)Y������hn��c�w�6�+�)��Y�gg�j�w��On�f���@��4<�@���_���JQ����'?������=�����<��{-Z�3ھ���jм�kQ=3��QG��A�k�_�^[�L�
�.v@�p\�}�Mvs2d[MjT�K�Ty������N�S,y��eDms�㒷�Y�)��Q@�C�&2B�b�y���e�
X< �ء݀%0��]�:�7����"!L̀�,�ɱxk������W'�*�Z�����))�q��H_�A�6�|���������y�:ۂs*w�,v.���N+�$��"A�59y� "�䴓���P���� q��Y�V .�C�_�/�á7�ň
�
�$�vtYu�"f�q,c6��Y����P�c��+2[�őfиXK[��'X=�b��w !����_�19peO�XK*��-�E��7���f��\�Bm��ru�l9�O��S/�R��Z8�d�#����"�<�.��D}�$< �{qkFҤr�X�E+�Z?�c�Pv��KR��B���u2U��Wp���n���SK�+KU�Q=<�ai`���:�B�`<Q���`����B���E���6���:%j5Ej�Ck��qY�C��}�����pp7��|ltys��}d�J[h a���P�����c���-�u?�#���_at�p����{���l���(_��PKE��OV�����e;�����)��v��a%Ÿ~ʥW6���3���待RP����6|-�������)�G�-m����v(���;�$��cC�D_�7�s���,��W&���4���f����i�T�����v�����n_�S��-�de^}XR�
B����_���?�@(��������`��s@��_ l�Xu�݌���~��~����
���y8p�B8���٧�����h�^����g�6�$�c~�Ί�8����by8����-FbAL+�<���H,o��:[2�P�M'b�f�f�ΝM$�Q(�=�T��O�<��A�����]�#�%��^��Z_MEqm`�o��=N�p=���hЃ�����mЩ�׽�+R����vzq�$(t�Z��V��{���p�o�<{���]I��"@�+�$�Y�b��r0_��K+����k(,iz�]
���	�����h󧴜��K˽����n����/���-#6������uHU. C��	R�.5"�	�(�9H��灍E7�͡VF�N�Y�R�=A5VJ�gN�aT�����vV�~�;��l�n]���W��p"���=?�:ؚDƁ y%��ĴG�V��gZT�ɕ�uɍ@l��g
k�`3z�޻P�fo@��y�w@�s��LA*�����77�v{�7�~^�N�c��\����<g�NNZ+��W(V�G(�:(��B##s,�LN|��nX�τ�x�E-E�����ř�P
��Z��g����Y��%#PJ��3PveaCc'P��Ӽx�P�C5���/k�:��<�����%���~RS�qk�pT�w�H���{ہ�6-�=(K����*�焎�r�lDC��9��|�r�V���v�����O�=�w��$/E`��w��p��Oh���è�F/��ߍ*��$��Ɛ��bj����Z!,�Y��ahT�Md��V�P֊26W`��Vn�G}t����^��}�v�<����WnGL�b�a�vR�Y�Ί�9�n�����r���̅�B?F40鲋9�)��H�,���7��G�'���\e:&�X���~�-Ev"���.���zc�j���J)Hy��rB�(ui�~�����<��'~�5l%.>
�X���O=�.��U��vA1��o�r恂;	��>��bY^�KU�v�K�g�@-2���	�7���������Ƶ�E
N�=K��yaw��D|"�k��t�Nz���WFo~�`�գ�[נ�����+G^�Uf>Y>��AI`ޟɺ4�����o�_o���R�G+8��gƤd���E�ahh�k(\OJR���#�:wz����۳.u����.w�<RI�d�� '�L��V�x6@
��Z��2j}�mR�Kgm'<��,澸����������'���דO���9pif~tN��D�Rk�U���S���a��^�����vqa���	<���7�~[�!��-R0����m��P)���آ��w֯�-�K�A��8%ٽ55�3*�P���cu��f&Y�%4ei)Q�$>�ɐ������c�~�ФJC�t_�V"x[��,bdt�iF%���*YI�I��&6�d*zd`ҕ�mD2*(�N;�D����T���EA*����=rA5!�.A������Ҁ�h`Wo�����++s���N@�|�쩬��7���e{��S�!Gv"�pX;�<�8��+��!�
V����5�VX-ѡ�G�M�p!��R=��S�cX�~�(��%<������Э������xv��9!�r�:@�0:�B�`RT1)��������Z�������'�X.����i/�X���(b��j������꽕��(b�	3T.s����D����0���e.&��;���A�z�����Lzl<�..M���s�[��례C����ݽ����cG{�<���:��!�#�*��l}��t�[V9���RrY��h���Y`�4�'������,�bS���I�� �t�DN�����	�G���.���o�덯>J6��3�l�Y����X��i��8�*�,Q�"{�՛
��ʝA"��6$T9�	�>��,����崧?�����`�Â�B�Q�sp&ieUG�%I�,�Z�}�`���9ԁϻ��L>���+%�)=!��Ѣxp+����2c�15�8���v�f*Sjn)2�̋�*ݢ���"cH�R5|} 0�u����^_mL�nY�Ia\R*��l���U�م{���G�<p�����x�Q�?:F ��L�s��bw���z��kMJ]k3/�]|T���6f�Mk�0�8�1�a��5e��Q�Z�c���<x���
D���8k����ŧ�u�����l/�1�#T0��,�����Tf`� FY��6ǫ ��~K�o�i�J�)B��<ލ��4
n�E��Ӛ�=%��t����z;��{	&p���'M�F�֖��dvnwǨ*9L�-5��iQ�5x�B�* -.nL_�
�`o̤����(�H�?��%6GQ�.�Nz! j��k=8��ԕL+�N�6;�;�N�u�f���&�s.�'Ķ�w��:4�y�.0�L�% �>C]7ԙ�B�	P7��n������غv�S��4�n�3�J�U�gg��<[M��kk@����bR��*�3Lc_ݛG�>}�����O/� A�\ $���sR�
�fF��m�H��y!�̶�Z�
���2ԨZ�����T�%����?'a?�F�0����\��+_�����c6�Ÿ{a�����g�_a8^G]V�����+���tRo��v�M�ĶV�d�+=BM�
�:ʲ얥������:?�Rhݵ!O�ym��8���     t~�$\k_������t�uD+����F[OFk�@2��� �����,�J�XtN!-B�8��������;�&$�iۥ^�K�ra�'q�� n'*�H�P��JXT�
��� �6]>j;Pyx8w��{km|��:\*�,��RQ�'�� 	e�_��n��^ms�
��Dk%���(༝������u�Z����Z W2�8
���������y<n(נMQN	C�l�{�`_:E����/�+�����[��$���7:����n���V�ui�a'@����{a'+I�����u�EVu�c��e+M%f��b.#�������n{b$��"�[�/K\M��E;w�v�`ɼ"%���� X�k�o܀l��ѵ�f���c�DsV`|nB���ї�<��Gc:!w�(QT%�{4�|/Q|�	=$��$�K!g�S�Ϫ�e|:�fCy�+���U����:D
&�R")K'��a���WF�n{�^(���y@F:���a'o+����<� �O��8I:4���yE�De���r��t}\�Á��_^��wWs.),�K9]x%a�����Ի꒏TM�=�i�E�=jY?0+\ʉ�#4V�Q��2����YE�>��/��5mE�M�8��An�h��x�IN�O�Ϧ�6VV+Щ���C��?��}�K/!	�_�Du^����u��ܩ5�l��v�{1��O�S&c���2��>�	��x����}V�~�q'O�X;����!�e>G���Ð������
C����8�D'\�8���pH+I�;���m8�ugZ�?�)ʶ��\�����5ܡVW]��`���E� ��1zQz��?N�-�K;���m"%����~v��wO�ו)�h+X����eB
�'����FY��O�����*r����_�9���~^�ݾ�ǐ{Љ���$Q���Q�q�X�4�����\-!���b�VtAܯ���	� ��/�����_נrk���<��J���Tz<� �j(n�
/8��7	���S��e��\]je��w��bޝƢ��(�"�B�Pfҽڍ(���,h�w����@ւ���� m^]�1�i��`�%�$B���i*g ��jK�Q}P��~�bX���SNX�]4����}	�V���������?��|ڧ�H���%���H�U0j?��u��\���a�( 9���P�Ë�v@H5�4*�x�}}s@V�'�J+��vL���6[T�]��n�˽��������a-m���ޒ����X?��*d�ý�A4�_o7ΞO� 3^��w!Mf{#�䂤	�e]�uc�ix<��tF�x�I Ϫv�@�#�Φ��&�Aa�&�V�`Ϙ�1z] �`53g<�L��9��Pvș�B�@Nd������_��o�&��	��o��F�If��M�T�"p�]�
�|��5LE��N^Ce)4��JZ�a�*su���(�����mIl��F�� Q(����iԤ�k0�c$�x{嘂����vX"�.���.>Mc�ԅ
K9�{�P������ۣ�F�l�ރ�F�R'D����;���v�5[�7�^�ܹ5y�BFu�(6��J� F�v�r�y�N�Q��f�LX���3=b��ܞ�R���4lyԣM�%x��2��G4�]�Eř|PP��ݕ�]��Pl�w�@�⬥�!�=�.� M���Y�[k���7aC1�* ���"��b�e���<9��6��{�mX����^%G���t�|4،���S+Y�ǎuwԯ���2 �R�sIp����.���JMEPCZ��'>(&�=w�~qӞa)	��o�Q�����D�.zJ0�M��<F��3�#`ĵ��8�!���5�u�t�
ؔψ���b:�7�)A=���sL�9��I�%���He�f$�fW��D�(��AJk�=��Qz'F8O��S5�:D�3pb�C��E�����⓪�)�,�L��x��pƟl�>����h<؆���F���P� �˓���ʤ�>�8�. ^>u��9��˽cK�s��@��d����{W�-^��:ϝ��Y�'��X���~���Gз��.�vqc�_ER=V���������+���VV�/��nf �c�NT5���`�=W�1N�e�'����v�$e�2͆l�-]�td�'���]=��f������:��J��a��	�$z�NP��_g2��l���_�m��r��]Ĳ��eH/P�o�(��|�!�r��	������M�{��A�>H˲�E��:m��h1�����'�#� 8�����.�[@Lg�8K��y+��t���ƻ���B�6�	O`�U�E�]�h/b`� &vA���}�E끨	��F#��nm����;��|�`��Xw��I�VVh�܅�����}���W_�t�����zG/��r���D��Z��к�����ۯ3�ݜ��|�*\
7�]�*�.P.�a��$��,�۠���S�\ sy��z8Y�������_��V���A��̡n]����-q_�D��k��On�F_m��yg�pu����͞���?MV%��P/0�;i���4��M��V ������W#��1�y��AW�6<�T��r�#�q�[i4a�.'��
�<�0�c�Ŧ��亮����������������l�!V��Բ�E4ֲ�R�8��k��f��:��+*{aEsm����s�@��v^��*i�=}:^tz������h
#y$��5.2�e�wF�L�g�$}LjF�?�ҫv<�<�Ї��>���@]N�%۸�OP��F�j+�����˄��)d{��9�}c]ւ�0��,�)%�ͼdA�^���;�%���^����o�=�T*c�}Bߜu�+X�^�L�ёPȔŠ�I;�؂p��(.\�Y�"�w�y3���8Ee�IZ�W�~qAVL�b��Ժ����O? �����oo����=%�4�g���-7�&kG��N,e�N��V!RY��ݙ��i�U��r��6iqUa��d�g\U(�����Wf�Ѹ�0[��H$Ȑ*������ȩ��0�Y )@�g�n�yo�DH���S��������QL
�,�qL����&��Eq��&=y~BiR��`^++�|���L4l��2�T��y��� '���uẻC�Qt�L��ANI�b����H���l
�����I�W>����WB����j�6�V�OG��掲�ln�(�,�t�}(��Q�1�hc��ukG��R;V�?N`�W�u~7CA�9�;�-�c8�����f����C�FQ n��e����; (rR�P6:CbS?�d_���+0~\S?YLy6"q=0t�<qO�%��&�������=�I
X�
/��އ�/8�8<�k�X�0P+��K"�Sw�Jm}"�Fi-�Ӓ1�d�}�,H�,7�N�˧;j��~]���%�\E���(t #	k��؃��k�H�+��F�~��5��S��ar�Q��N����~`'�a2 �fq�f��6êlI�ɔ��g6���P�vr�v�k�������s��6A�?MY���L:>�Kkev݉w\��������7���G�*瞆]S
V�(��ݭ��^�G���Y�m�`.JD�<!��ȫ�>=r�������V�	/��2��8	�@�n�O>��b�󻵝�f��\v���-z�a�e�����9��^:zdR������ӧ�.��'#U������u%�K/�L�����z��� .�{� f�7>�UW��� G�T3�������T����CoB�B�N�4^���(n!�1��#�ʅZ!��9�OS�po���!�G�������U0�h���R��,N-�jx���2uI|���b¬�`�we㊳7 �f�Q10p'RX�n!r�ڤ8j,#V�b曊1����\�-DГ@д5���;��v���`�2BH^�`#f\�@f���T��i��	�{�[H�\��/��R(�e�7Rh���u��6����$�@^//��y�    �'��QqR�e��_ɋ�u�a:Z2�Z�r3�MML?<�4�f�OTb���}��g�>������V�L`�=e�(�LRZ$1���xJ��=޹2|�������n��.S~�]ϯ�My�^.��al�;z�MX���0I-�I?�$/����JG������0��NT���*t:P����d�O��)��
���5w�u*6:�Q��/ͪ�x͂�;>�����N��;��k!e����K��<�	��������<j,�-��*	n�y�i9�́�� oڏS�: �;i��u���μ��U(�m��s��x��FtI��nx�i���^ܚ��n��j!�v��5�BƼ�MW��z�)��tB!�����wXI#`T���7�1a��	����O�������6������}� L�덹ޛ/��F׷���BkU7�$�U���-3�X%
��(z*�Mc�w��U�R�N��P6�^AyȄ�6�:,�[����o��C�ݫ�}u�7����޵��G���BK�<�2�-��ZB�u��T���_̠�-�-�L迴f�<�po�yĻ��1�󵎞��_��{��6�i T��E�]�V7�d�m8�)�,-�u:(�g�g��ބ8˞Q����rJ\k۝��nˏ����WM`[3�XG����E��ZФ�������[���_@̅E	��x��o�_���ȹ����jk0�x�Ƅq�Q߶c��F�IX��c%c��Y��cy�i���%�n��E*Yz�+T�ru���'�B����1`m�^
*!q��hMH-�; ����XFR�y�tX$�*��L)BJ����)�)!�P�����9^4�r'm��:r��pmm��Mɷ@��]��Rhb#��膨В Q�cUu�e�%5Q��R4�n�W�h�wWA]��w��W� ��Y���W�q����X��v�5	�cs"ҪL1�`&�V��lh}#��wD[`Jm��5C[�12��c����������WF�x���:�bu��������ׇ�H���<1Vv��Bcf&"���s��V\�l�q�J�ܦS�3\�����Jp�E�+�l�ȯBly^��.����D�����yB�2a�NQ����flI"��vX�k���]�3tuh<N�V$Y�FY)�O'�qϥ� ��&�iK�m�MT{*=T��D�
�m���K��	8��o�>�W.fQFy��ԝk�Y��B�7v>���	H�"t��`�������0R��8�2����h*3���.t���t�~Ɏ�`��D�tL��{%T���f�_{W��q���W̧���.��2���ĊcBo��֔��I.o��$��%�]Q[��*b +j'���?�������}_����|�qR���3܇sN���Z9̇�_�H�;��+^��3i�^
���+�ag2L���o�{\��-�B�������{��� �>H`f���F��r����&,�5�vKHŲx϶�m��ie�w	�f.�Q3���&�p	�r��y$Y�#���>b0��y��+ɢ\rA��'Y�5�$�/S�t���r��5t�"��<{j�����}�<%�	�:1�����!
��-K0L,&���Ey�A0;�Z�����2 ���7���h'[�_|1H�i�``_`n�� �$b�9M�q��.!��@LQU��q���Qyzѐ9ʴx�r�5�^cMdB�����.�ӅG���KH?�ꍆ��s��NK��(z&L	ٟa��Dϖ6����D���~H�\�$*aLo5�1�^�	�bv��VЕ�t���V`e/��L!l�=�+Ϙ��r�!W*�+����&��+���G��O�I�O'R�e�H"���#(D��Y�A�8�e֞%��RԿb�s%���<R*:JuQĦ�L�d�J� =k��b��芣��z�Ji�'�T��������b�ѥ���-chj��V ���gLZ|�[�@���?��=���R@�4sK�֌v��\�{8�dU"�! ŧ2��3m������8\I�xɰ$:����V�
��-4D�[`
KfYMfɔ�Z`�X2[]�>��|8p�;�{�@�c�TC�r�Ϗ'S��ϓYZ��lXV�s�L�M�{y2��T��7[���i�i!���m���h�[�o�?�`g�É�\���ߛ9�I7a'0�'�챮��X���):�&8V6����^�˦ue��q�ȡ��袿Tz���k�}���nho}��w,�d����8"V'������s��N�YZ�[�;��tP��ٕ��d�n^�]]�������{>:-'�	h\a¦�+��l��]�65u��x�	/��bm����M��q.�y1�*��
N��7���͑�^�M~�M�AqX����TsK-����6ö��m��/;F)��oJ�W�{�`G<��|x��G���ݢt&?�4���������%P�#���/kn/�L���� ̳��0pm˭��U1��>������7ק�����i�d��6
�Ē���sԲ� ����%/Ȇly�y�r�
/myC`EIV�auX�!��w-a�Pް:J=��\K�M3��4�ݚ�$k��}���$P����A�gp:I�#�F������yAk�AZ�lH�����r��d@��ȁM����o����!f��������v�+�a�k�h"�J86i�D ���TH��-꫻�HV����� UJèR��ɳ��Y�� �8�$�Ohu5�,��DmU�p�ܠ���\�h�C�2�/��d���_���c��`��O6��;�ܶ"�I)k r��B���}5_<�ƙ0�i�!
:�{�-[F�!;͑w�
���,����EG�y��ȡ&���aҋ-:�)���vC&Ҧ�*W�s����O�n7
÷4�;N3�L���]�4Fj��ې�0��݄T^ ��	��Kn0ֿ�j������b��z&��s,4�m��O��I FzHL:+���f�W�0�vEn�V��-� c���8��#���
�i�h�����_�-����������tT�
%�فg �5����cD�9��%ߕ!P1���@��B݌�������M&�-X�ݩ�>۟�n��k�^�	q������%�[u�!���H��Ѐ�Y b�n��!��!��,�\�����vx`DĘ(�š�����>��Y��$���e\�a�bzx��0�f��K���ω�Д���w������Hf�SSͮ�|�����|cز��_�����d�R����x���s���LCI{ܤ����q7O����{`Q����𙳧m������L~
97�Fe��Jd(�`%�-��
�J�:�8&�P]�F9ɇ�v�K���?��up_W6`��Υ���Adx�*C`��K����
c�zw�ZMk�p�Ϛ7,����q�����Ţ�W�,/�/=���+�z�_7FPWV���Bc�r�+��rxs�u	y>�oo����\ ��T����#�N��JT��OÂ�I��h�3����3:]��#تj��%I{[&3S>��͌��#5���r �(_���F�������SK5�G���\�]"f/#Z�2��S����%�_��{9'�<��>���M��W��L��r�ݵ��4����^l����T�t�!&�Շ���e�0:�^�̛|��|�w�ȁ����.a�έu��o�pz��Pq�3��$���H!4� �+�5�'Ν{����u�?Ͻ��+�+|\\;Iq��d��G��^��b���VI�񉽶i�t�S�,gBp'��M�}�a��|s<���DQ�N��2ka�������Ʈ�T��9�w�,�'iל�^3[v�<#=�k�A,���XQ�'�/Ϫ�`��.G���׬���t��x�<��ON!���^Z*���W ��ǳ��N�b:���V b!|qh�jX�Αg���p״�� $e���U��S.��E��T�����%Lw�����Oa�zw� �_?���:&l��$L��f�����    yF� �ܬNXYz�_�>��~�7S����	>N���BP��S��Tz�HFY"UMк�gZ�Jf~"Qv~���'���㊁~z��t�+[���pn�B;瓫&����@���!���]��N����#������pn���q2�R�M3G��^��Xr�[�����-�Cd8�SKh٫d��w�ɐ�RZ�78WD���2���f%��"�*�4SU�1Xs&6[G^Uk��9�	������P��]*P3N��b�)TO��q�����+����ٗ����߻�j��"Y�����-�rn>�Mb� h &��QQv�	������Ps[��i��``|*H��u���y�%�uFfWCr��`���s�}����}��ˆ'!3���3q���%]�/��̍�$M��[� �`n'�*�_��!���a�|�zx%������.��-e����/��Ndk9Ǳ+�N'[�G۾fp݇��a&��+�R�����yr0�J��o\��16����ZH�v $ҩ~}���:6b@|�!���K�������Bk��*h���'N���T�v�����pOFt뺍y�wGnL)s�����H�w����L�ր`Kqd���胇�c�)�# �J������vx~2oDW�-��	@ɳ`!�F�e�r^��̋QjzA�u&I�a3�1<rg���B&�b�t��oL6�W"�SKq�b�+<����٭���=(r���7�N�y���V��B�O,��yF�	u�[����uJ�/a@h �C[�P˨�D5V1��i&s�E�^�%�K��b�Ý��^;st��uL�k�ƏI�X�
Z:��� F����~ lBe�z�as�$-�QDǑ2���r��[E5��U��\�:Ǒ�c��S�R�v��ѵ�Ǐ�^~2{|7�@A����L�T͕`��H��S�}*� ��8�-x���H�^����K����͍�	/�1i�ɢ��E�Un|���}��:=&֍y���c� �C���1l�R��Q��.�bU�ߞmݞnnήo�/_�_ڛ~���w֛S�a�'D��a̝��^���8������3�j�8͞ѓ��C�2�SS�n�G�����	m�F��J���&�\��HN�ڗ����-���IL7X�P�,�D��H�s���`Ӟg$������ߍ�TZF�<��v��.�"�Z��@g�j?��t���lg&�Ǐ�@i.^~��e���g@O7�������VΟ~���so]�:w��?�;�b�"6X�n�xw�ѽ���$:Vz.�m�� #��`�f�!�
s3nϱ ���i�._p��H�H.�(����U��L�:u��eZ��0."0��p���ŷ���皃���dWP7�x2�I�ȑga��
�I�_�BX�$�/q�L�vt�Pk�MG���X�bky��~�5�y
]��qS�K����h�;@�-|��d��jE���G��Qr�q���R�y�܄wMI+K,�	���1��0"�CL��G��������׻�ßڏ�22.��'`~|�8[5���������8+qd�Xbi��k�Q�d�4I�1b"#��qIK����������Mͯ�a���^�G����O�&nA�> smG"�׻N��o��O�A��$(_fD�%	Z�e#�,��V#��T
k*�n+�sp0dI���A8|Qd���~�Kʠ#*�AB�Ky"�6�p�K�	�Sǎ7 ԕ7I�V�U��yf�P�+�撛����R��aG�������Q�U_d4�O�BR�+��	]�8�l�Ώk)����� +�;��\�z�T�e��sd���Mzk��a�4��V�!֌�~u
UE���tb�Q�RG�����y�̿��>Z�����V=m������k��ϋ����f7�j�p�7�M&pj)?�~R| <_��d?Q:Fa�|��2��E���h�#�����Q���+�bB���^�p������i.3
�K����y�;5�e���x��wDRR��5T81���"D~:�V�V�s��WϞ�9
��J*a���Z��.�C�V���s8����ڛ�a�� GO���wpT��ص/j�N��︃������&��W��޹m��wǳ��*�V����'m�FÛ��7�)&��f7�3,Y ���F����ӧ��\�h}~s��1Ř�Ϧx��NV�����O[��϶n�77f_=�!�ݻ9�:�j�*3^�@���J[�:�tN�p�����m)���	Ս	�99����_���� ��VF5�%������b�ٙ>ss/�F�P,�oUBBY�6��A+ՔzwL2c����
���|�ŝ��oy�f�_���	J����Zꭿ��(��m5��n�x=-n�mϝ�1��F@�W�21�c�x�#nI�ܑܶ������l��\�q9'��e�B���/O�Ѝ��Y�p�>���<���*NU��t��p���h�a��0b��jȁҎy�R��<�x)|�4��a� �SH�V�L�U�Tix�qC�1r� �w��fz�/5��Q���������8$��6��!��l�z|m�F]f5������Z�P�ǭ㊶q�ayUO�p�Q����j�;��ΐ$�#����WE
����;��%1�U<����qF]��2.�F;��|Dڿ/����:"s���uc�$>Bl�h��;���t6�r�����/����d�3�l�ͯoM�g2ms���7��-�OV�;��ٗ���zs�n%�_� ����֫��Í�>�?<l�A�~T�4S��h��Yw.���a�D��f}k������E3����c��"�L��`7��q�,o���&qg�� �p�A�mD��'�,�k�,&6��Zd��U5<Å�7I[́U�K�w��oո1�욞���N�U�4M�����������νh�힟R��x�*���on�AbQV�e�[ޙ暁	J�oN�7$6��PGt�A����V�#N�+_�r����z�ªyi�dt�����_�BJl��ʀє����F]��It5M����,M¦4��(�l]��H��֐�	��5�5�9SM�L.��C��鵍�������$v�����&��dFr���+Ti[��Se1V�XҬʁ�gL �j -�=��^X�4b�y��(��q�c~�q�B��Ύ��h�qŁ�W��^\QXɠv�-���-Md���(ނGR�IY4/}ֽ��
�*I~z�RC�3J�����{,��&�o69dKY1�%�,�zՆ���_Y�	QN0��al;:�r�dc���������l��t���%O��qzxti���C��(Iq
�j�^���Y^�^�D@���-��6nkvc2�v�p۹��Y�S(������^Tqs��ʧ
	`�a��)�HO��/�B��ZL�{[X+nW�� ��Iq8R�M~�}�x�'�L o��ISI���<k�e'��8��'���Ω
b'�8�cm�C6VK�EN�^�������*���ҭ|�x�3����uC#D���"�li��4u�EO�d9�3�z�a�<��Ò����x!&���u�㠹9����c����7t�E6����L���MyvY�jb
�l�H���Qd����]ز0�\l�&%�AE��Ĥ��I����y��B��^(��b	)δfX���,�Iz5���
6�Z�J��`%��Cm�i�����Β��;��V�'%m��MS���p���2)/�ڃU��ɳ�kk��Z��aP�6���uukY?���^K�E/��C,�� ��8����Ba������"�U�]�t������8(^�l��iUX�(�,A�$HrY¤*0FP�|d���W�a�Yɫ~Y�za$$%Z�հ���Y��Z��iZ�t�w�Ӛ��KFB�v]3X�a��H}~���o�����&�Ѥ���?+2���OV(�yFz�r���Nhl�4GJJeUȤ��K�!n����Oom�nݟ]�����g_l��ۄ������P�&G���T׸��{@� vg B  Oμ�{�����vt�5�� Q�w������<[������P�K�Li�d_�*`k9�e�cL�Σ� -Z��g�;xh�qD(u2e;�J1U��;4������|c n�h����+��6F|�q�����#
*�W�+#��&�$:��
�miad�
x�ڬL-����2-�y�����/��� xq�]������^�e��x���⑛cȔr�ϭ�����K���Lu�-ۑ�q�ȼČ�G�ɼ��������`v�lT��̲���yj6���ؐ�Ltn��f`gonf"cXnI��Lnf,��׺[���Dj��o�n�E�+,n������k�?o�����a�I�C�Z�o�"���ȵ�wHN����>�w�eˋU��|�\��0"`��
�v�A���fF)�T��G�a;�te�ҫ��g������k��lURM�b<�U�Z@����׶���m����Y�^����W|�vmV_�%2w-���Cv�=7'�G|�G!hY!�e���6a�L�tjP�H�k�7n{Js�TN`����~r����u��Ɔ�����L�;��k>���а�P�i����D�q�4�����]7��G-8� ����y��|�)$X�g<ǟ�^�=D�V��:�=��q�/x����w�{�2~��X&�zw��5{����dP^WD�>����,#�k��7�9��瓌�?���f�
����J�����ٞ�"��g����j��o��/�y�����~]lNB)@-x�G��as���k}r�ܝ�oϯ^��RV�SP�XީA՘>1����hޚ~�7ݸl�����;O�i���yp��o�?]����G&�<�.g�����.����4��@����.V5���K��Jc?D�@,sѬ�9^(�Q�*��ԜVm�P���	��~���	2���>9�z��w~W���7�憀��M&ݴ� ����a� �咖fc�p���8��N&�BB��'���ك���/8Ø�Pᚳ�󩥕ݟx��q�ͧ�m������ |���/>M�e@㒮y�s��aulr�s������     